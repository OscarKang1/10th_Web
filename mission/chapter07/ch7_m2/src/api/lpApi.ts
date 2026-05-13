import axiosInstance from './axiosInstance';
import type { Lp, LpListResponse, SortOrder, CommentListResponse, CreateLpRequest, UpdateLpRequest } from '../types/lp';

export async function getLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const { data } = await axiosInstance.get('/v1/lps', { params: { order, cursor, limit } });
  return data.data;
}

export async function getMyLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const { data } = await axiosInstance.get('/v1/lps/user', { params: { order, cursor, limit } });
  return data.data;
}

export async function getLikedLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const { data } = await axiosInstance.get('/v1/lps/likes/me', { params: { order, cursor, limit } });
  return data.data;
}

export async function getLpById(id: number): Promise<Lp> {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data.data;
}

export async function getComments(
  lpId: number,
  order: SortOrder = 'desc',
  cursor: number = 0,
  limit: number = 10,
): Promise<CommentListResponse> {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor, limit },
  });
  return data.data;
}

export async function postComment(lpId: number, content: string): Promise<void> {
  await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
}

export async function updateComment(lpId: number, commentId: number, content: string): Promise<void> {
  await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
}

export async function deleteComment(lpId: number, commentId: number): Promise<void> {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
}

export async function createLp(body: CreateLpRequest): Promise<Lp> {
  const { data } = await axiosInstance.post('/v1/lps', body);
  return data.data;
}

export async function updateLp(id: number, body: UpdateLpRequest): Promise<Lp> {
  const { data } = await axiosInstance.patch(`/v1/lps/${id}`, body);
  return data.data;
}

export async function deleteLp(id: number): Promise<void> {
  await axiosInstance.delete(`/v1/lps/${id}`);
}

export async function likeLp(id: number): Promise<void> {
  await axiosInstance.post(`/v1/lps/${id}/likes`);
}

export async function unlikeLp(id: number): Promise<void> {
  await axiosInstance.delete(`/v1/lps/${id}/likes`);
}
