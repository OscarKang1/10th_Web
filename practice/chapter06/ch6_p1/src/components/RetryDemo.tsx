import { useMyQuery, clearCache } from '../hooks/useMyQuery';

const MAX_RETRY = 3;
const RETRY_DELAY = 1500;
const QUERY_KEY = ['retry-demo'];
const CACHE_KEY = JSON.stringify(QUERY_KEY);

// 항상 실패하는 queryFn (서버 오류 시뮬레이션)
const failingQueryFn = async (): Promise<never> => {
  await new Promise((r) => setTimeout(r, 800)); // 네트워크 지연 흉내
  throw new Error('500 Internal Server Error');
};

// 처음 N번은 실패하고 이후엔 성공하는 queryFn
function makeFlakeyQueryFn(failTimes: number) {
  let callCount = 0;
  return async (): Promise<{ message: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    callCount++;
    if (callCount <= failTimes) throw new Error(`500 Internal Server Error (${callCount}번째 실패)`);
    return { message: `${callCount}번째 시도에서 성공!` };
  };
}

// flaky 함수를 훅 바깥에서 생성 → 리렌더 시 재생성 방지
let flakeyFn = makeFlakeyQueryFn(2);

export default function RetryDemo() {
  const {
    data: alwaysFailData,
    isLoading: af_loading,
    isError: af_error,
    error: af_err,
    isFetching: af_fetching,
    retryCount: af_retry,
    refetch: af_refetch,
  } = useMyQuery<never>({
    queryKey: QUERY_KEY,
    queryFn: failingQueryFn,
    retry: MAX_RETRY,
    retryDelay: () => RETRY_DELAY,
  });

  const {
    data: flakeyData,
    isLoading: fk_loading,
    isError: fk_error,
    error: fk_err,
    isFetching: fk_fetching,
    retryCount: fk_retry,
    refetch: fk_refetch,
  } = useMyQuery<{ message: string }>({
    queryKey: ['flakey-demo'],
    queryFn: () => flakeyFn(),
    retry: MAX_RETRY,
    retryDelay: () => RETRY_DELAY,
  });

  const resetAlwaysFail = () => {
    clearCache(CACHE_KEY);
    af_refetch();
  };

  const resetFlakey = () => {
    clearCache(JSON.stringify(['flakey-demo']));
    flakeyFn = makeFlakeyQueryFn(2);
    fk_refetch();
  };

  return (
    <div className="demo-box">
      <h2>Retry 체험</h2>
      <p className="desc">
        실패 시 자동으로 재시도합니다 (<code>retry: {MAX_RETRY}</code>,{' '}
        <code>retryDelay: {RETRY_DELAY / 1000}초</code>).
      </p>

      {/* 항상 실패 */}
      <div className="retry-panel">
        <h3>① 항상 실패하는 요청</h3>
        <div className="retry-status">
          {(af_loading || af_fetching) && !af_error && (
            <span className="badge fetching">
              {af_retry === 0
                ? '⏳ 최초 요청 중...'
                : `🔄 ${af_retry}번째 재시도 중... (최대 ${MAX_RETRY}회)`}
            </span>
          )}
          {af_error && (
            <span className="badge error">
              ❌ 최종 실패 — {af_err?.message} ({af_retry}회 재시도 후 포기)
            </span>
          )}
        </div>
        <button onClick={resetAlwaysFail} disabled={af_fetching} className="btn-small">
          {af_fetching ? '진행 중...' : '다시 시도'}
        </button>
      </div>

      {/* Flakey (2번 실패 후 성공) */}
      <div className="retry-panel">
        <h3>② 2번 실패 후 성공하는 요청</h3>
        <p className="desc small">retry 덕분에 결국 성공하는 케이스입니다.</p>
        <div className="retry-status">
          {(fk_loading || fk_fetching) && !fk_error && !flakeyData && (
            <span className="badge fetching">
              {fk_retry === 0
                ? '⏳ 최초 요청 중...'
                : `🔄 ${fk_retry}번째 재시도 중...`}
            </span>
          )}
          {fk_error && (
            <span className="badge error">
              ❌ 최종 실패 — {fk_err?.message}
            </span>
          )}
          {flakeyData && (
            <span className="badge success">
              ✅ {flakeyData.message} (retry {fk_retry}회 사용)
            </span>
          )}
        </div>
        <button onClick={resetFlakey} disabled={fk_fetching} className="btn-small">
          {fk_fetching ? '진행 중...' : '처음부터 다시'}
        </button>
      </div>
    </div>
  );
}
