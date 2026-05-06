import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlaceholder';
import InfinitePostsAutoJsonPlaceholder from './components/InfinitePostsAutoJsonPlaceholder';

const queryClient = new QueryClient();

export default function App() {
  const [mode, setMode] = useState<'button' | 'auto'>('button');

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
        <h1>무한 스크롤 실습</h1>

        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <button
            onClick={() => setMode('button')}
            style={{ fontWeight: mode === 'button' ? 'bold' : 'normal' }}
          >
            버튼 더보기
          </button>
          <button
            onClick={() => setMode('auto')}
            style={{ fontWeight: mode === 'auto' ? 'bold' : 'normal' }}
          >
            자동 무한 스크롤
          </button>
        </div>

        {mode === 'button'
          ? <InfinitePostsJsonPlaceholder />
          : <InfinitePostsAutoJsonPlaceholder />
        }
      </div>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
