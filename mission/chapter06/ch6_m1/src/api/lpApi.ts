import axiosInstance from './axiosInstance';
import type { Lp, LpListResponse, SortOrder } from '../types/lp';

export async function getLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const { data } = await axiosInstance.get('/v1/lps', { params: { order, cursor, limit } });
  return data.data;
}

export async function getLpById(id: number): Promise<Lp> {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data.data;
}
