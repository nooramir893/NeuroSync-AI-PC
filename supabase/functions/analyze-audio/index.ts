import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const HF_TOKEN = Deno.env.get("HF_TOKEN");
const TRANSCRIBE_MODEL = Deno.env.get("HF_TRANSCRIBE_MODEL") ?? "openai/whisper-tiny";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logError = (msg: string, extra?: unknown) => {
  console.error(`[analyze-audio] ${msg}`, extra ?? "");
};

const callHF = async (model: string, body: Uint8Array, retries = 3) => {
  if (!HF_TOKEN) throw new Error("HF_TOKEN not set");

  const url = `https://router.huggingface.co/pipeline/automatic-speech-recognition?model=${encodeURIComponent(model)}&wait_for_model=true`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body,
      });

      if (!res.ok) {
        const text = await res.text();

        // Model cold start uses 503 with estimated_time
        if (res.status === 503) {
          const estimatedTime = Number.parseFloat(JSON.parse(text)?.estimated_time ?? "15");
          const waitMs = Number.isFinite(estimatedTime) ? estimatedTime * 1000 : 15000;
          console.log(`Model ${model} loading; waiting ${waitMs}ms (attempt ${attempt}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        logError(`HF ${model} error ${res.status} (attempt ${attempt}/${retries})`, text);
        if (attempt === retries) {
          throw new Error(`HF ${model} error ${res.status}: ${text}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      return res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`Retry ${attempt}/${retries} for ${model} due to:`, err);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error(`Failed after ${retries} attempts`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = new Uint8Array(await req.arrayBuffer());
    if (!body.length) throw new Error("Empty audio data received");

    let transcription = "";
    try {
      const transcriptJson = await callHF(TRANSCRIBE_MODEL, body);
      transcription =
        typeof transcriptJson === "string"
          ? transcriptJson
          : transcriptJson?.text ?? transcriptJson?.[0]?.text ?? "";

      if (!transcription || transcription.toLowerCase().includes("unavailable")) {
        throw new Error("Transcription unavailable");
      }
    } catch (err) {
      logError("Transcription failed", err);
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    return new Response(
      JSON.stringify({ transcription }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (err) {
    logError("Unhandled error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
