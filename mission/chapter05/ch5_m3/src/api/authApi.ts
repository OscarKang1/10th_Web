import axiosInstance from './axiosInstance';
import type { SignInRequest, SignInResponse, SignUpRequest } from '../types/auth';

export async function signUp(body: SignUpRequest): Promise<void> {
  await axiosInstance.post('/v1/auth/signup', body);
}

export async function signIn(body: SignInRequest): Promise<SignInResponse> {
  const { data } = await axiosInstance.post('/v1/auth/signin', body);
  return data.data;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  avatar: string | null;
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get('/v1/users/me');
  return data.data;
}
