const API_BASE = "http://localhost:3000";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.message ? data.message : "Request failed";
    throw new Error(msg);
  }

  return data;
}

