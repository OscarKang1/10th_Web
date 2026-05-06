import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLps } from '../api/lpApi';
import type { SortOrder } from '../types/lp';
import LpCard from '../components/LpCard';
import { LpCardSkeleton, ErrorState } from '../components/Skeleton';

export default function HomePage() {
  const [sort, setSort] = useState<SortOrder>('desc');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps(sort, 0, 20),
    staleTime: 1000 * 60 * 3,   // 3분
    gcTime: 1000 * 60 * 10,     // 10분
  });

  const lps = data?.data ?? [];

  return (
    <div className="p-6 pb-20">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">LP 목록</h1>

        {/* 정렬 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSort('desc')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              sort === 'desc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              sort === 'asc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {Array.from({ length: 8 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {isError && <ErrorState message="LP 목록을 불러오지 못했어요." onRetry={refetch} />}

      {/* LP 그리드 */}
      {!isLoading && !isError && (
        <>
          {lps.length === 0 ? (
            <p className="text-center text-[#555] py-20">LP가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
              {lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
