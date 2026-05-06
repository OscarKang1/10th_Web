import { useCustomFetch } from '../hooks/useCustomFetch';
import type { Post } from '../types/api';

export default function PostList() {
  const { data, isLoading, isError, error, isFetching } = useCustomFetch<Post[]>(
    'https://jsonplaceholder.typicode.com/posts'
  );

  if (isLoading) return <p className="status">불러오는 중...</p>;
  if (isError) return <p className="status error">에러 발생: {error.message}</p>;

  return (
    <div>
      {isFetching && <p className="fetching-badge">백그라운드 갱신 중...</p>}
      <ul className="card-list">
        {data?.map((post) => (
          <li key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <span className="tag">user #{post.userId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
