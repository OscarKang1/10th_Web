import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../api/lpApi';
import type { SortOrder } from '../types/lp';
import LpCard from '../components/LpCard';
import { LpCardSkeleton, ErrorState } from '../components/Skeleton';
import CreateLpModal from '../components/CreateLpModal';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [sort, setSort] = useState<SortOrder>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) => getLps(sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <div className="p-6 pb-20 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">LP 목록</h1>

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

      {/* 초기 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {Array.from({ length: 8 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {isError && <ErrorState message="LP 목록을 불러오지 못했어요." onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          {lps.length === 0 ? (
            <p className="text-center text-[#555] py-20">LP가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
              {lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
            </div>
          )}

          {/* 추가 로딩 스켈레톤 (하단) */}
          {isFetchingNextPage && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-5">
              {Array.from({ length: 4 }).map((_, i) => <LpCardSkeleton key={i} />)}
            </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div ref={sentinelRef} className="h-10" />

          {!hasNextPage && lps.length > 0 && (
            <p className="text-center text-[#555] text-sm py-4">모든 LP를 불러왔습니다.</p>
          )}
        </>
      )}

      {/* LP 추가 FAB */}
      {isLoggedIn && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ff2d78] text-white text-2xl flex items-center justify-center shadow-lg hover:bg-[#e0266a] transition-colors cursor-pointer z-20 border-none"
          aria-label="LP 추가"
        >
          +
        </button>
      )}

      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
