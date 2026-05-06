import type { Lp, LpListResponse, SortOrder } from '../types/lp';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLps(order: SortOrder = 'desc', cursor: number = 0, limit: number = 20): Promise<LpListResponse> {
  const res = await fetch(`${BASE_URL}/v1/lps?order=${order}&cursor=${cursor}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? 'LP 목록 조회에 실패했습니다.');
  return data.data;
}

export async function getLpById(id: number): Promise<Lp> {
  const res = await fetch(`${BASE_URL}/v1/lps/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? 'LP 상세 조회에 실패했습니다.');
  return data.data;
}
