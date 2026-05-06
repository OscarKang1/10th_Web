import { useInfiniteQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 10;

async function fetchPosts({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('네트워크 에러');
  return (await res.json()) as Post[];
}

export default function InfinitePostsJsonPlaceholder() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', PAGE_SIZE],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.length < PAGE_SIZE;
      return isLast ? undefined : allPages.length + 1;
    },
  });

  if (isLoading) return <div>로딩 중이에요...</div>;
  if (error) return <div>에러가 발생했어요: {error.message}</div>;

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <ul key={pageIndex} style={{ marginBottom: 16 }}>
          {page.map((post) => (
            <li key={post.id}>
              <strong>#{post.id}</strong> {post.title}
            </li>
          ))}
        </ul>
      ))}

      <div>
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </button>
        ) : (
          <span>마지막 페이지예요.</span>
        )}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        상태: {status} / 다음 페이지 가능: {String(!!hasNextPage)}
      </div>
    </div>
  );
}
