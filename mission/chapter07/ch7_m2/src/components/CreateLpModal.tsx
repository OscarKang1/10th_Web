import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp, updateLp } from '../api/lpApi';
import { uploadImage } from '../api/userApi';
import type { Lp } from '../types/lp';

interface CreateLpModalProps {
  onClose: () => void;
  initialLp?: Lp;
}

export default function CreateLpModal({ onClose, initialLp }: CreateLpModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialLp?.title ?? '');
  const [content, setContent] = useState(initialLp?.content ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialLp?.thumbnail ?? '');
  const [previewUrl, setPreviewUrl] = useState(initialLp?.thumbnail ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(initialLp?.tags?.map((t) => t.name) ?? []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const isEditMode = !!initialLp;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let finalThumbnail = thumbnailUrl;

      if (selectedFile) {
        finalThumbnail = await uploadImage(selectedFile);
      }

      if (!finalThumbnail) throw new Error('썸네일 이미지를 선택해주세요.');

      if (isEditMode) {
        return updateLp(initialLp.id, { title, content, thumbnail: finalThumbnail, tags });
      }
      return createLp({ title, content, thumbnail: finalThumbnail, tags, published: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['lp', String(initialLp.id)] });
      }
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message || '요청에 실패했습니다.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setThumbnailUrl('');
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    if (!content.trim()) { setError('내용을 입력해주세요.'); return; }
    if (!selectedFile && !thumbnailUrl) { setError('썸네일 이미지를 선택해주세요.'); return; }
    if (tags.length === 0) { setError('태그를 최소 1개 입력해주세요.'); return; }
    mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={onClose}
    >
      <div
        className="bg-[#111] border border-[#2a2a2a] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">
            {isEditMode ? 'LP 수정' : 'LP 추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors text-xl leading-none cursor-pointer bg-transparent border-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 썸네일 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#888]">LP 이미지</label>
            <div
              className="relative w-full aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden border-2 border-dashed border-[#333] cursor-pointer hover:border-[#555] transition-colors flex items-center justify-center bg-[#1a1a1a]"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#555] text-sm">클릭하여 이미지 선택</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-[#555] text-center">JPG, PNG, GIF 등 이미지 파일</p>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888]">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              maxLength={100}
              className="w-full py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
            />
          </div>

          {/* 내용 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888]">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP에 대한 설명을 입력하세요"
              rows={4}
              maxLength={2000}
              className="w-full py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors resize-none"
            />
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#888]">태그</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="태그를 입력하세요"
                maxLength={30}
                className="flex-1 py-2.5 px-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2a2a2a] text-[#aaa] hover:bg-[#333] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                추가
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff2d78]/20 text-[#ff2d78] text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="leading-none text-[#ff2d78]/70 hover:text-[#ff2d78] cursor-pointer bg-transparent border-none p-0"
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-[#ff4d4f] text-center py-2 px-3 bg-[rgba(255,77,79,0.1)] border border-[rgba(255,77,79,0.3)] rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg text-sm font-semibold bg-[#ff2d78] text-white hover:bg-[#e0266a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer mt-1"
          >
            {isPending ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? 'LP 수정' : 'Add LP')}
          </button>
        </form>
      </div>
    </div>
  );
}
