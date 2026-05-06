import { useMyQuery } from '../hooks/useMyQuery';
import type { User } from '../types/api';

const MAX_RETRY = 2;

type Props = { url: string };

export default function UserCard({ url }: Props) {
  const { data, isLoading, isError, error, isFetching, retryCount, dataSource } =
    useMyQuery<User>({
      queryKey: [url],
      queryFn: async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<User>;
      },
      staleTime: 10 * 1000, // 10초 — 토글 후 재마운트 시 캐시 체험
      retry: MAX_RETRY,
      retryDelay: () => 1000,
    });

  // 캐시 데이터 있으면 백그라운드 갱신 중에도 바로 표시
  if (data) {
    return (
      <div className="user-card">
        <span className={`source-badge ${dataSource}`}>
          {dataSource === 'cache' ? '💾 캐시에서 불러옴' : '🌐 네트워크에서 불러옴'}
        </span>
        {isFetching && <p className="refreshing">백그라운드 갱신 중...</p>}
        <h2 className="user-name">{data.name}</h2>
        <p className="user-email">{data.email}</p>
        <p className="user-id">User ID: {data.id}</p>
      </div>
    );
  }

  if (isLoading && retryCount === 0) {
    return <div className="user-card state-card">불러오는 중...</div>;
  }

  if (isLoading && retryCount > 0) {
    return (
      <div className="user-card state-card">
        🔄 재시도 중... ({retryCount} / {MAX_RETRY})
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-card state-card error-state">
        <p>❌ {error?.message}</p>
        <p className="retry-info">{MAX_RETRY}회 재시도 후 포기</p>
      </div>
    );
  }

  return null;
}
