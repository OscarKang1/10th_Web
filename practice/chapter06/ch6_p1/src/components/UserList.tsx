import { useCustomFetch } from '../hooks/useCustomFetch';
import type { User } from '../types/api';

export default function UserList() {
  const { data, isLoading, isError, error, isFetching } = useCustomFetch<User[]>(
    'https://jsonplaceholder.typicode.com/users'
  );

  if (isLoading) return <p className="status">불러오는 중...</p>;
  if (isError) return <p className="status error">에러 발생: {error.message}</p>;

  return (
    <div>
      {isFetching && <p className="fetching-badge">백그라운드 갱신 중...</p>}
      <ul className="card-list">
        {data?.map((user) => (
          <li key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>@{user.username}</p>
            <p>{user.email}</p>
            <p>{user.company.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
