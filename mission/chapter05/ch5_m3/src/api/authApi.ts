import axiosInstance from './axiosInstance';
import type { SignInRequest, SignInResponse, SignUpRequest } from '../types/auth';

export async function signUp(body: SignUpRequest): Promise<SignInResponse> {
  const { data } = await axiosInstance.post<SignInResponse>('/v1/auth/signup', body);
  return data;
}

export async function signIn(body: SignInRequest): Promise<SignInResponse> {
  const { data } = await axiosInstance.post<SignInResponse>('/v1/auth/signin', body);
  return data;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get<UserProfile>('/v1/auth/me');
  return data;
}
