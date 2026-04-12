const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anonKey);
export const isSupabaseStorageEnabled = hasSupabase;

const authStorageKey = 'aishorthub.supabase.session';

function buildHeaders(accessToken, extra = {}) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken || anonKey}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    return { data: null, error: data?.error_description || data?.message || `HTTP ${response.status}` };
  }
  return { data, error: null };
}

export function getStoredSession() {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(authStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (typeof localStorage === 'undefined') return;
  if (!session) {
    localStorage.removeItem(authStorageKey);
    return;
  }
  localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export async function authRequest(path, payload) {
  if (!hasSupabase) return { data: null, error: 'Supabase env missing' };
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: 'POST',
    headers: buildHeaders(null),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function fetchTable(table, query = '', accessToken) {
  if (!hasSupabase) return { data: null, error: 'Supabase env missing' };
  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    headers: buildHeaders(accessToken),
  });
  return parseResponse(response);
}

export async function insertTable(table, payload, accessToken) {
  if (!hasSupabase) return { data: null, error: 'Supabase env missing' };
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: buildHeaders(accessToken, { Prefer: 'return=representation' }),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateTable(table, query, payload, accessToken) {
  if (!hasSupabase) return { data: null, error: 'Supabase env missing' };
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: buildHeaders(accessToken, { Prefer: 'return=representation' }),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function uploadToStorage(bucket, path, file, accessToken) {
  if (!hasSupabase) return { data: null, error: 'Supabase env missing' };
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken || anonKey}`,
      'x-upsert': 'true',
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const body = await response.text();
    return { data: null, error: body || `Storage upload failed: ${response.status}` };
  }

  return { data: { path, publicUrl: `${url}/storage/v1/object/public/${bucket}/${path}` }, error: null };
}
