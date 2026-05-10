import axiosInstance from './axiosInstance';
import type { Lp, LpListResponse, SortOrder, CommentListResponse } from '../types/lp';

export async function getLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const { data } = await axiosInstance.get('/v1/lps', { params: { order, cursor, limit } });
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
