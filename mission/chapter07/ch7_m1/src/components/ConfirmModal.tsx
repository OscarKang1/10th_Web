interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = '예',
  cancelLabel = '아니오',
  danger = false,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={onCancel}
    >
      <div
        className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <p className="text-white text-sm leading-relaxed text-center">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-transparent border border-[#444] text-[#aaa] hover:border-[#666] hover:text-white transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              danger
                ? 'bg-[#ff4d4f] text-white hover:bg-[#e03a3c] border-none'
                : 'bg-[#ff2d78] text-white hover:bg-[#e0266a] border-none'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
