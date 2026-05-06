import { useState, useEffect, useRef, useCallback } from 'react';

// ─── 캐시 저장소 ────────────────────────────────────────────────────────────
// 모듈 스코프에 두어 모든 컴포넌트가 공유 → QueryClient와 같은 역할
type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};

const globalCache = new Map<string, CacheEntry<unknown>>();

export const clearCache = (key?: string) => {
  if (key) globalCache.delete(key);
  else globalCache.clear();
};

// ─── 타입 ────────────────────────────────────────────────────────────────────
export type QueryState<T> = {
  data: T | undefined;
  isLoading: boolean;   // 캐시가 전혀 없는 최초 로딩
  isError: boolean;
  error: Error | null;
  isFetching: boolean;  // 백그라운드 갱신 포함 모든 fetch 중
  retryCount: number;   // 현재까지 재시도한 횟수
  dataSource: 'cache' | 'network' | null;
};

type UseMyQueryOptions<T> = {
  queryKey: unknown[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  retry?: number;
  retryDelay?: (attemptIndex: number) => number;
};

// ─── 훅 ──────────────────────────────────────────────────────────────────────
export function useMyQuery<T>({
  queryKey,
  queryFn,
  staleTime = 0,
  retry = 0,
  retryDelay = (i) => Math.min(1000 * Math.pow(2, i), 30000),
}: UseMyQueryOptions<T>) {
  const cacheKey = JSON.stringify(queryKey);

  // 함수 옵션은 ref로 관리 → 변경돼도 재실행 방지
  const queryFnRef = useRef(queryFn);
  const retryDelayRef = useRef(retryDelay);
  queryFnRef.current = queryFn;
  retryDelayRef.current = retryDelay;

  // 초기 상태: 이미 캐시가 있으면 바로 반영
  const [state, setState] = useState<QueryState<T>>(() => {
    const entry = globalCache.get(cacheKey) as CacheEntry<T> | undefined;
    const isFresh = !!entry && Date.now() - entry.fetchedAt <= staleTime;
    return {
      data: entry?.data,
      isLoading: !entry,
      isError: false,
      error: null,
      isFetching: !isFresh,
      retryCount: 0,
      dataSource: isFresh ? 'cache' : null,
    };
  });

  const isMountedRef = useRef(true);
  // 세대(generation) 카운터: 동시 실행 충돌 방지
  const generationRef = useRef(0);

  const execute = useCallback(async () => {
    const generation = ++generationRef.current;

    const entry = globalCache.get(cacheKey) as CacheEntry<T> | undefined;
    const isFresh = !!entry && Date.now() - entry.fetchedAt <= staleTime;

    // ① 캐시가 유효하면 네트워크 요청 없이 즉시 반환
    if (isFresh) {
      setState({
        data: entry.data,
        isLoading: false,
        isError: false,
        error: null,
        isFetching: false,
        retryCount: 0,
        dataSource: 'cache',
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      isFetching: true,
      isError: false,
      error: null,
      retryCount: 0,
    }));

    let attempt = 0;

    // ② 재시도 루프
    while (true) {
      try {
        const data = await queryFnRef.current();

        if (!isMountedRef.current || generationRef.current !== generation) return;

        globalCache.set(cacheKey, { data, fetchedAt: Date.now() });
        setState({
          data,
          isLoading: false,
          isError: false,
          error: null,
          isFetching: false,
          retryCount: attempt,
          dataSource: 'network',
        });
        return;
      } catch (err) {
        if (!isMountedRef.current || generationRef.current !== generation) return;

        if (attempt < retry) {
          attempt++;
          // 재시도 전 상태 업데이트 → UI에서 카운트 표시 가능
          setState((prev) => ({ ...prev, retryCount: attempt }));
          await new Promise<void>((resolve) =>
            setTimeout(resolve, retryDelayRef.current(attempt - 1))
          );
          if (!isMountedRef.current || generationRef.current !== generation) return;
        } else {
          // ③ 재시도 소진 → 에러 확정
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isError: true,
            error: err instanceof Error ? err : new Error(String(err)),
            isFetching: false,
            retryCount: attempt,
          }));
          return;
        }
      }
    }
  }, [cacheKey, staleTime, retry]);

  useEffect(() => {
    isMountedRef.current = true;
    execute();
    return () => {
      isMountedRef.current = false;
    };
  }, [execute]);

  // 캐시를 무효화하고 강제 재요청
  const refetch = useCallback(() => {
    globalCache.delete(cacheKey);
    setState((prev) => ({
      ...prev,
      isLoading: !prev.data,
      isFetching: true,
      isError: false,
      error: null,
      retryCount: 0,
    }));
    execute();
  }, [cacheKey, execute]);

  return { ...state, refetch, cacheKey };
}
