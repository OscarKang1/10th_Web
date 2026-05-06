import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/lp';

export default function LpCard({ lp }: { lp: Lp }) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      {/* 앨범 아트 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/300x300/222/555?text=LP';
        }}
      />

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <p className="text-white text-sm font-semibold line-clamp-2 leading-snug mb-1">
          {lp.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-[#ccc]">
          <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
          <span className="text-[#ff2d78]">♥ {lp.likes.length}</span>
        </div>
      </div>
    </div>
  );
}
