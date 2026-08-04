export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`API Request failed: ${res.statusText}`);
  }
  return res.json();
}
