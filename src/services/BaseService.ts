export async function request<T = unknown>(
  url: string = '',
  data: Record<string, unknown> = {},
  mock: { on: boolean; data: T } = { on: false, data: {} as T },
  method: 'get' | 'post' = 'get'
): Promise<T | null> {
  if (mock.on) {
    return Promise.resolve(mock.data);
  }

  const options: RequestInit =
    method === 'post'
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      : { method: 'GET' };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json() as Promise<T>;
}
