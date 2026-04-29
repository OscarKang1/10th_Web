import type { SignInRequest, SignInResponse, SignUpRequest } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function signUp(body: SignUpRequest): Promise<SignInResponse> {
  const res = await fetch(`${BASE_URL}/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? '회원가입에 실패했습니다.');
  }

  return data;
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
