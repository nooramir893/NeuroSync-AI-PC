import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const RECORDINGS_BUCKET = 'recordings';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} else {
  // Warn instead of crashing so the UI can show a friendly message.
  console.warn('Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
}

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and restart dev server.');
  }
  return supabase;
};

export const upsertProfile = async (client: SupabaseClient, {
  id,
  full_name,
  avatar_url,
  phone,
  emergency_contact,
}: {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  emergency_contact?: string;
}) => {
  // Upsert so we can call this on signup or later profile updates.
  return client.from('profiles').upsert({ id, full_name, avatar_url, phone, emergency_contact });
};

export const fetchProfile = async (client: SupabaseClient, id: string) => {
  return client.from('profiles').select('full_name, avatar_url, phone, emergency_contact').eq('id', id).single();
};

export const uploadRecording = async (client: SupabaseClient, userId: string, blob: Blob) => {
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  const filePath = `${userId}/${Date.now()}-${uniqueId}.${ext}`;

  const { error } = await client
    .storage
    .from(RECORDINGS_BUCKET)
    .upload(filePath, blob, {
      cacheControl: '3600',
      contentType: blob.type || `audio/${ext}`,
      upsert: false,
    });

  if (error) throw error;
  return filePath;
};

export const insertRecordingMetadata = async (
  client: SupabaseClient,
  payload: {
    user_id: string;
    storage_path: string;
    duration_ms?: number;
    transcript?: string;
    emotion_label?: string;
    emotion_score?: number;
  }
) => {
  const { error } = await client.from('recordings').insert({
    user_id: payload.user_id,
    storage_path: payload.storage_path,
    duration_ms: payload.duration_ms ?? null,
    transcript: payload.transcript ?? null,
    emotion_label: payload.emotion_label ?? null,
    emotion_score: payload.emotion_score ?? null,
  });
  return { error };
};
