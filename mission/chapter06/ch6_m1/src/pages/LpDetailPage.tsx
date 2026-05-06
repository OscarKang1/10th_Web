import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpById } from '../api/lpApi';
import { DetailSkeleton, ErrorState } from '../components/Skeleton';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();

  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpById(Number(lpId)),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

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
      <div className="flex gap-3">
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
    </div>
  );
}
