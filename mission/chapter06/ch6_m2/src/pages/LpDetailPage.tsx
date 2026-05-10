import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getLpById, getComments, postComment } from '../api/lpApi';
import type { SortOrder } from '../types/lp';
import { DetailSkeleton, CommentSkeleton, ErrorState } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [commentOrder, setCommentOrder] = useState<SortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const commentSentinelRef = useRef<HTMLDivElement>(null);

  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpById(Number(lpId)),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const {
    data: commentData,
    isLoading: isCommentLoading,
    isFetchingNextPage: isFetchingMoreComments,
    fetchNextPage: fetchMoreComments,
    hasNextPage: hasMoreComments,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, commentOrder],
    queryFn: ({ pageParam }) => getComments(Number(lpId), commentOrder, pageParam as number, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!lpId,
    staleTime: 1000 * 60,
  });

  const comments = commentData?.pages.flatMap((p) => p.data) ?? [];

  const onCommentIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasMoreComments && !isFetchingMoreComments) {
        fetchMoreComments();
      }
    },
    [hasMoreComments, isFetchingMoreComments, fetchMoreComments],
  );

  useEffect(() => {
    const el = commentSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onCommentIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onCommentIntersect]);

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (content: string) => postComment(Number(lpId), content),
    onSuccess: () => {
      setCommentInput('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
  });

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed || !lpId) return;
    submitComment(trimmed);
  }

  if (isLoading) return <DetailSkeleton />;
  if (isError || !lp) return <ErrorState message="LP를 불러오지 못했어요." onRetry={refetch} />;

  return (
    <div className="p-6 pb-20 max-w-2xl mx-auto">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#888] hover:text-white text-sm mb-6 flex items-center gap-1 cursor-pointer bg-transparent border-none"
      >
        ← 목록으로
      </button>

      {/* LP 썸네일 */}
      <div className="flex justify-center mb-8">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#222] shadow-[0_0_0_12px_#111,0_0_0_14px_#333]">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/256x256/222/555?text=LP';
            }}
          />
        </div>
      </div>

      {/* 제목 / 메타 정보 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-2">{lp.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[#666]">
          <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
          <span>♥ {lp.likes.length}</span>
          {lp.author && <span>by {lp.author.name}</span>}
        </div>
      </div>

      {/* 본문 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{lp.content}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 mb-10">
        <button className="px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-[#ff2d78] text-[#ff2d78] hover:bg-[#ff2d78]/10 transition-colors cursor-pointer">
          ♥ 좋아요
        </button>
        <button className="px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-[#555] text-white hover:border-[#888] transition-colors cursor-pointer">
          수정
        </button>
        <button className="px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-[#555] text-[#ff4d4f] hover:border-[#ff4d4f] transition-colors cursor-pointer">
          삭제
        </button>
      </div>

      {/* 댓글 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">댓글</h2>

          {/* 정렬 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setCommentOrder('desc')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                commentOrder === 'desc'
                  ? 'bg-[#ff2d78] text-white'
                  : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setCommentOrder('asc')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                commentOrder === 'asc'
                  ? 'bg-[#ff2d78] text-white'
                  : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
              }`}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* 댓글 입력 */}
        {accessToken && (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력하세요..."
                maxLength={500}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmitting}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#ff2d78] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e0266a] transition-colors cursor-pointer"
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </div>
            {commentInput.length >= 480 && (
              <p className="text-xs text-[#888] mt-1 text-right">{commentInput.length}/500</p>
            )}
          </form>
        )}

        {/* 초기 댓글 로딩 스켈레톤 */}
        {isCommentLoading && (
          <div>
            {Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)}
          </div>
        )}

        {/* 댓글 목록 */}
        {!isCommentLoading && (
          <>
            {comments.length === 0 ? (
              <p className="text-center text-[#555] text-sm py-10">첫 댓글을 남겨보세요.</p>
            ) : (
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id} className="flex gap-3 py-3 border-b border-[#2a2a2a]">
                    <div className="w-8 h-8 rounded-full bg-[#333] overflow-hidden shrink-0">
                      {comment.author.avatar ? (
                        <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#888]">
                          {comment.author.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{comment.author.name}</span>
                        <span className="text-xs text-[#555]">
                          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm text-[#bbb] break-words">{comment.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* 추가 댓글 로딩 스켈레톤 (하단) */}
            {isFetchingMoreComments && (
              <div>
                {Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
              </div>
            )}

            {/* 무한스크롤 트리거 */}
            <div ref={commentSentinelRef} className="h-6" />

            {!hasMoreComments && comments.length > 0 && (
              <p className="text-center text-[#555] text-xs py-4">모든 댓글을 불러왔습니다.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
