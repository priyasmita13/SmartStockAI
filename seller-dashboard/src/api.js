const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function normalizePath(path) {
  if (!path.startsWith('/')) return '/' + path;
  return path;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${normalizePath(path)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
} 