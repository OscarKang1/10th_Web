export function LpCardSkeleton() {
  return (
    <div className="aspect-square rounded-lg bg-[#2a2a2a] animate-pulse" />
  );
}

export function DetailSkeleton() {
  return (
    <div className="p-6 max-w-2xl mx-auto animate-pulse">
      <div className="h-5 bg-[#2a2a2a] rounded w-1/2 mb-6" />
      <div className="w-64 h-64 rounded-full bg-[#2a2a2a] mx-auto mb-8" />
      <div className="h-6 bg-[#2a2a2a] rounded w-3/4 mb-3" />
      <div className="flex gap-4 mb-6">
        <div className="h-4 bg-[#2a2a2a] rounded w-24" />
        <div className="h-4 bg-[#2a2a2a] rounded w-12" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-[#2a2a2a] rounded" />
        <div className="h-4 bg-[#2a2a2a] rounded w-5/6" />
        <div className="h-4 bg-[#2a2a2a] rounded w-4/6" />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="animate-pulse flex gap-3 py-3 border-b border-[#2a2a2a]">
      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#2a2a2a] rounded w-24" />
        <div className="h-3 bg-[#2a2a2a] rounded w-full" />
        <div className="h-3 bg-[#2a2a2a] rounded w-3/4" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <p className="text-[#ff4d4f] text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-md text-sm bg-[#1a1a1a] border border-[#333] text-white hover:border-[#555] cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  );
}
