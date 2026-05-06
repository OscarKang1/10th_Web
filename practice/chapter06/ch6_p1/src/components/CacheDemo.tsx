import { useState, useEffect } from 'react';
import { useMyQuery, clearCache } from '../hooks/useMyQuery';
import type { User } from '../types/api';

const STALE_TIME = 20 * 1000; // 20초 (체험하기 쉽게 짧게)
const QUERY_KEY = ['cache-demo-users'];
const CACHE_KEY = JSON.stringify(QUERY_KEY);

function UserCard() {
  const { data, isLoading, isFetching, dataSource } = useMyQuery<User[]>({
    queryKey: QUERY_KEY,
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((r) => r.json()),
    staleTime: STALE_TIME,
  });

  const [remaining, setRemaining] = useState<number | null>(null);

  // 남은 staleTime을 1초마다 갱신
  useEffect(() => {
    if (dataSource !== 'network') return;
    const tick = () => {
      const entry = (window as any).__cacheDebug?.get(CACHE_KEY);
      if (!entry) return;
      const left = Math.max(0, STALE_TIME - (Date.now() - entry.fetchedAt));
      setRemaining(Math.ceil(left / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dataSource]);

  if (isLoading) return <p className="status">최초 로딩 중... (네트워크 요청)</p>;

  return (
    <div className="cache-result">
      <div className={`source-badge ${dataSource ?? ''}`}>
        {dataSource === 'cache'
          ? '💾 캐시 적중! 네트워크 요청 없이 즉시 반환'
          : '🌐 네트워크에서 새로 불러옴'}
      </div>
      {isFetching && <p className="fetching-badge">백그라운드 갱신 중...</p>}
      {dataSource === 'network' && remaining !== null && remaining > 0 && (
        <p className="stale-timer">
          ⏱ 이 캐시는 <strong>{remaining}초</strong> 뒤 만료됩니다
        </p>
      )}
      {dataSource === 'network' && remaining === 0 && (
        <p className="stale-timer expired">⚠ 캐시 만료 — 다음 마운트 시 재요청</p>
      )}
      <p className="data-info">{data?.length}명의 유저 데이터 보유 중</p>
    </div>
  );
}

export default function CacheDemo() {
  const [show, setShow] = useState(true);

  const handleClearCache = () => {
    clearCache(CACHE_KEY);
    setShow(false);
    setTimeout(() => setShow(true), 50);
  };

  return (
    <div className="demo-box">
      <h2>캐시 / staleTime 체험</h2>
      <p className="desc">
        컴포넌트를 <strong>숨겼다가 다시 보이면</strong> — 20초 이내면 캐시에서 즉시 반환,
        이후엔 네트워크 재요청. 이게 <code>staleTime</code>의 역할입니다.
      </p>

      <div className="button-group">
        <button onClick={() => setShow((v) => !v)}>
          {show ? '컴포넌트 언마운트 (숨기기)' : '컴포넌트 다시 마운트'}
        </button>
        <button onClick={handleClearCache} className="btn-secondary">
          캐시 비우고 재시작
        </button>
      </div>

      <div className="component-area">
        {show ? <UserCard /> : <p className="unmounted">컴포넌트가 언마운트 되었습니다.</p>}
      </div>
    </div>
  );
}
