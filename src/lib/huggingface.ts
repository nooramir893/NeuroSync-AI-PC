const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const TRANSCRIBE_MODEL = import.meta.env.VITE_HF_TRANSCRIBE_MODEL || 'openai/whisper-tiny';
const EMOTION_MODEL = import.meta.env.VITE_HF_EMOTION_MODEL || 'superb/hubert-large-superb-er';
const HF_PROXY_URL = import.meta.env.VITE_HF_PROXY_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const fetchWithAuth = async (url: string, blob: Blob) => {
  if (!HF_TOKEN) {
    throw new Error('Hugging Face token missing. Add VITE_HF_TOKEN to .env.local');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': blob.type || 'application/octet-stream',
    },
    body: blob,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Hugging Face error (${response.status}): ${text}`);
  }

  return response;
};

const analyzeViaProxy = async (blob: Blob) => {
  if (!HF_PROXY_URL) return null;
  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');

  const res = await fetch(HF_PROXY_URL, {
    method: 'POST',
    // No headers: let the browser set multipart/form-data boundary; avoid preflight issues.
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF proxy error (${res.status}): ${text}`);
  }
  const data = await res.json();
  return {
    transcription: data?.transcription as string | undefined,
    emotionLabel: data?.emotionLabel as string | undefined,
    emotionScore: data?.emotionScore as number | undefined,
  };
};

export const transcribeAudio = async (blob: Blob) => {
  const proxy = await analyzeViaProxy(blob);
  if (proxy) {
    if (proxy.transcription) return proxy.transcription;
    throw new Error('Proxy did not return transcription');
  }
  throw new Error('No transcription service configured.');
};

export const detectEmotion = async (blob: Blob) => {
  const proxy = await analyzeViaProxy(blob);
  if (proxy) {
    return { label: proxy.emotionLabel || 'unknown', score: proxy.emotionScore };
  }
  throw new Error('No emotion service configured.');
};

export const analyzeAudio = async (blob: Blob) => {
  // Prefer proxy once to avoid multiple uploads.
  if (HF_PROXY_URL) {
    const result = await analyzeViaProxy(blob);
    return {
      transcript: result?.transcription,
      emotionLabel: result?.emotionLabel,
      emotionScore: result?.emotionScore,
    };
  }

  const transcript = await transcribeAudio(blob);
  const emotion = await detectEmotion(blob);
  return {
    transcript,
    emotionLabel: emotion.label,
    emotionScore: emotion.score,
  };
};
