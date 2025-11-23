const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Default to a model that works with v1beta generateContent.
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-latest';

export type GeminiAnalysis = {
  sensing: string;
  plan: string;
};

export type GeminiHabit = {
  title: string;
  label: string;
  description: string;
};

export type GeminiInsight = {
  insight: string;
};
export type GeminiPrediction = {
  prediction: string;
};
export type GeminiPlanHelp = {
  plan: string;
};
export type GeminiMoodTitle = {
  title: string;
};

export const generateWorkoutExercises = async (input: {
  transcript?: string;
  emotionLabel?: string;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';

  const prompt = `
You are a concise trainer. Suggest a quick mood-boost workout the user can do right now with no equipment.
- Use the transcript and emotion cue for context.
- Return at most 5 short exercise lines (fewer is fine), each a single sentence.
- Keep them simple: stretches, light cardio, yoga poses, bodyweight moves. Do NOT include breathing exercises.
- Output ONLY a JSON array of strings, no extra text, no code fences, no Markdown.

Transcript: ${transcript}
Emotion: ${emotion}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini workout error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  // Clean possible code fences
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Try to parse JSON array
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).slice(0, 5);
    }
  } catch {
    // ignore and fallback
  }

  // Fallback: split by lines/commas and strip brackets/quotes
  const fallback = cleaned
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(/[\n,]/)
    .map((l) => l.replace(/^[\s"-]*/, '').replace(/[\s"-]*$/, '').trim())
    .filter(Boolean)
    .slice(0, 5);

  return fallback;
};

export const generateHabitForToday = async (input: {
  transcript?: string;
  emotionLabel?: string;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';
  const seed = Math.random().toString(36).slice(2, 8);

  const prompt = `
You are a concise habit coach. Based on the user's transcript and tone, suggest one simple, immediate habit they can do right now (no equipment). Vary the habit so it does not repeat the same suggestion every time for similar moods. Avoid breathing-focused habits (there is a separate section for that).
- Title: short action line (e.g., "Practice presentation opening 3× with power poses")
- Label: 2-3 words describing the habit type (e.g., "Confidence builder", "Mood lift", "Reset move")
- Description: one short paragraph on how to do it and why it helps. Keep it mood-specific and immediate.

Output ONLY JSON in this shape:
{
  "title": "...",
  "label": "...",
  "description": "..."
}

Transcript: ${transcript}
Emotion: ${emotion}
Seed: ${seed}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini habit error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.title && parsed.description) {
      return {
        title: String(parsed.title),
        label: String(parsed.label || 'Quick habit'),
        description: String(parsed.description),
      } as GeminiHabit;
    }
  } catch {
    // ignore
  }

  // Fallback: if parsing fails, return empty so UI can use defaults.
  return null;
};

export const generateInsight = async (input: {
  transcript?: string;
  emotionLabel?: string;
  emotionScore?: number;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';
  const score = typeof input.emotionScore === 'number' ? input.emotionScore.toFixed(2) : undefined;

  const prompt = `
You are a brief observer. Give one concise insight about the user's state based on the transcript and tone.
- One short sentence, supportive and actionable.
- No advice beyond the single sentence.

Transcript: ${transcript}
Emotion: ${emotion}${score ? ` (score: ${score})` : ''}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini insight error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  if (!text) return null;
  return { insight: text } as GeminiInsight;
};

export const generatePrediction = async (input: {
  transcript?: string;
  emotionLabel?: string;
  emotionScore?: number;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';
  const score = typeof input.emotionScore === 'number' ? input.emotionScore.toFixed(2) : undefined;

  const prompt = `
You are a brief coach. Predict how the user is likely to feel after completing their plan (workout + habit), based on their current transcript and tone.
- Return one short sentence, encouraging and specific.
- No extra formatting.

Transcript: ${transcript}
Emotion: ${emotion}${score ? ` (score: ${score})` : ''}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini prediction error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  if (!text) return null;
  return { prediction: text } as GeminiPrediction;
};

export const generateMoodTitle = async (input: {
  transcript?: string;
  emotionLabel?: string;
  sensing?: string;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';
  const sensing = input.sensing?.trim() || '';

  const prompt = `
Give a 1-3 word mood title based on the transcript, tone, and this sensing text. Be concise, no punctuation.
Sensing: ${sensing}
Transcript: ${transcript}
Emotion: ${emotion}
Only return the title text, nothing else.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini mood title error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  if (!text) return null;
  const title = text.split('\n')[0].trim();
  return { title } as GeminiMoodTitle;
};

export const generatePlanHelp = async (input: {
  transcript?: string;
  emotionLabel?: string;
  emotionScore?: number;
  exercises?: string[];
  habitTitle?: string;
  habitDescription?: string;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim() || 'Not available';
  const emotion = input.emotionLabel?.trim() || 'Not available';
  const score = typeof input.emotionScore === 'number' ? input.emotionScore.toFixed(2) : undefined;
  const exercises = (input.exercises || []).slice(0, 5).join(' | ') || 'Not available';
  const habitTitle = input.habitTitle || 'Not available';
  const habitDescription = input.habitDescription || '';

  const prompt = `
You are a concise coach. Summarize in up to 10 short lines how the recommended steps will help the user, based on their mood.
- Mention workout items and the habit briefly.
- Tone: supportive, clear, practical.
- One short sentence per line. No bullets/markdown code fences.

Transcript: ${transcript}
Emotion: ${emotion}${score ? ` (score: ${score})` : ''}
Exercises: ${exercises}
Habit: ${habitTitle} — ${habitDescription}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini plan help error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  if (!text) return null;
  // Ensure max 10 lines
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 10);
  return { plan: lines.join('\n') } as GeminiPlanHelp;
};

const blobToBase64 = (blob: Blob): Promise<{ base64: string; mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64] = result.split('base64,');
      if (!base64) return reject(new Error('Failed to parse base64 audio'));
      resolve({ base64, mimeType: (blob as File).type || 'audio/webm' });
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(blob);
  });

export const transcribeAudioWithGemini = async (audio: Blob | File): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const { base64, mimeType } = await blobToBase64(audio);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY,
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Transcribe this audio in English. Return only the transcript text, no extra commentary.',
              },
              {
                inlineData: {
                  mimeType,
                  data: base64,
                },
              },
            ],
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini STT error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('\n')
      .trim() || '';

  if (!text) {
    throw new Error('Gemini returned no transcript');
  }

  return text;
};

export const analyzeStateWithGemini = async (input: {
  transcript?: string;
  emotionLabel?: string;
  emotionScore?: number;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const transcript = input.transcript?.trim();
  const emotion = input.emotionLabel?.trim();
  const score = typeof input.emotionScore === 'number' ? input.emotionScore.toFixed(2) : undefined;

  const prompt = `
You are an empathetic listener. Based on the transcript and tone label, state what the user seems to feel in up to 5 short lines (fewer is okay). No plans, no advice—just reflect their emotional/energy state.

Transcript: ${transcript || 'Not available'}
Emotion label: ${emotion || 'Not available'}${score ? ` (score: ${score})` : ''}
`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
    GEMINI_API_KEY,
  )}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  },
);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('\n').trim();

  if (!text) {
    throw new Error('Gemini returned no content');
  }

  // We only need sensing lines; leave plan empty so UI can fallback.
  const sensing = text;
  const plan = '';

  return { sensing, plan } as GeminiAnalysis;
};
