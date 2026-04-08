const BASE_URL = 'http://localhost:8000';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export async function signIn(body: SignInRequest): Promise<SignInResponse> {
  const res = await fetch(`${BASE_URL}/v1/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? '로그인에 실패했습니다.');
  }

  return data;
}
