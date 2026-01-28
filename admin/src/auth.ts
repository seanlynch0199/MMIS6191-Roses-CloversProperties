const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthed(): boolean {
  return getToken() !== null;
}

type FetchOptions = RequestInit & {
  skipAuthRedirect?: boolean;
};

export async function authFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const token = getToken();
  const { skipAuthRedirect, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipAuthRedirect) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  return response;
}
