import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/lp';

interface LpCardProps {
  lp: Lp;
  onEdit?: (lp: Lp) => void;
  onDelete?: (lp: Lp) => void;
}

export default function LpCard({ lp, onEdit, onDelete }: LpCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/300x300/222/555?text=LP';
        }}
      />

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <p className="text-white text-sm font-semibold line-clamp-2 leading-snug mb-1">
          {lp.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#ccc]">
            <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
            <span className="text-[#ff2d78]">♥ {lp.likes.length}</span>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button
                  onClick={() => onEdit(lp)}
                  className="px-2 py-1 rounded text-xs bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer border-none"
                >
                  수정
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(lp)}
                  className="px-2 py-1 rounded text-xs bg-[#ff4d4f]/60 hover:bg-[#ff4d4f]/90 text-white transition-colors cursor-pointer border-none"
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
