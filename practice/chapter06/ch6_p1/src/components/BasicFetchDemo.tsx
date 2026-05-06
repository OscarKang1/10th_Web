import { useMyQuery } from '../hooks/useMyQuery';
import type { User } from '../types/api';

export default function BasicFetchDemo() {
  const { data, isLoading, isError, error, isFetching, dataSource, refetch } =
    useMyQuery<User[]>({
      queryKey: ['users'],
      queryFn: () =>
        fetch('https://jsonplaceholder.typicode.com/users').then((r) => r.json()),
      staleTime: 5 * 60 * 1000, // 5분
    });

  if (isLoading) return <p className="status">불러오는 중...</p>;
  if (isError) return <p className="status error">에러: {error?.message}</p>;

  return (
    <div>
      <div className="demo-header">
        <div className={`source-badge ${dataSource ?? ''}`}>
          {dataSource === 'cache' ? '💾 캐시에서 불러옴' : '🌐 네트워크에서 불러옴'}
        </div>
        <button onClick={refetch} className="btn-small">강제 새로고침</button>
      </div>
      {isFetching && <p className="fetching-badge">백그라운드 갱신 중...</p>}

      <ul className="card-list">
        {data?.map((user) => (
          <li key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>@{user.username} · {user.email}</p>
            <p>{user.company.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
