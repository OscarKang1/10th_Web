import axiosInstance from './axiosInstance';
import type { UserProfile, UpdateProfileRequest } from '../types/user';

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get('/v1/users/me');
  return data.data;
}

export async function updateProfile(body: UpdateProfileRequest): Promise<UserProfile> {
  const { data } = await axiosInstance.patch('/v1/users', body);
  return data.data;
}

export async function deleteAccount(): Promise<void> {
  await axiosInstance.delete('/v1/users');
}

export async function logoutApi(): Promise<void> {
  await axiosInstance.post('/v1/auth/signout');
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post('/v1/uploads', formData);
  return data.data.imageUrl as string;
}
