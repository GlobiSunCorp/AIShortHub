const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anonKey);

export async function supabaseFetch(path, options = {}) {
  if (!hasSupabase) {
    return { data: null, error: 'Supabase env missing (mock mode).' };
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    return { data: null, error: `Supabase request failed: ${response.status}` };
  }

  const data = await response.json();
  return { data, error: null };
}
