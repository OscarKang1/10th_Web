import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateProfile, uploadImage } from '../api/userApi';
import { getMyLps, getLikedLps } from '../api/lpApi';
import type { UpdateProfileRequest } from '../types/user';
import type { SortOrder } from '../types/lp';
import LpCard from '../components/LpCard';
import { LpCardSkeleton } from '../components/Skeleton';

type Tab = 'my' | 'liked';

export default function MyPage() {
  const { userName, userId, updateUserName } = useAuth();
  const queryClient = useQueryClient();

  // 프로필 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editError, setEditError] = useState('');

  // 탭 / 정렬
  const [tab, setTab] = useState<Tab>('my');
  const [sort, setSort] = useState<SortOrder>('desc');


  const sentinelRef = useRef<HTMLDivElement>(null);

  // 프로필 조회
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
  });

  // 내가 게시한 LP
  const {
    data: myLpData,
    isLoading: isMyLpLoading,
    fetchNextPage: fetchNextMyLp,
    hasNextPage: hasNextMyLp,
    isFetchingNextPage: isFetchingMyLp,
  } = useInfiniteQuery({
    queryKey: ['myLps', sort],
    queryFn: ({ pageParam }) => getMyLps(sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: tab === 'my' && userId !== 0,
    staleTime: 1000 * 60 * 3,
  });

  // 내가 좋아요한 LP
  const {
    data: likedLpData,
    isLoading: isLikedLpLoading,
    fetchNextPage: fetchNextLikedLp,
    hasNextPage: hasNextLikedLp,
    isFetchingNextPage: isFetchingLikedLp,
  } = useInfiniteQuery({
    queryKey: ['likedLps', sort],
    queryFn: ({ pageParam }) => getLikedLps(sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: tab === 'liked' && userId !== 0,
    staleTime: 1000 * 60 * 3,
  });

  const lps = tab === 'my'
    ? (myLpData?.pages.flatMap((p) => p.data) ?? [])
    : (likedLpData?.pages.flatMap((p) => p.data) ?? []);

  const isLpLoading = tab === 'my' ? isMyLpLoading : isLikedLpLoading;
  const hasNextPage = tab === 'my' ? hasNextMyLp : hasNextLikedLp;
  const isFetchingNextPage = tab === 'my' ? isFetchingMyLp : isFetchingLikedLp;
  const fetchNextPage = tab === 'my' ? fetchNextMyLp : fetchNextLikedLp;

  // 무한스크롤
  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  // 프로필 수정 (닉네임 낙관적 업데이트)
  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const body: UpdateProfileRequest = {};
      const trimmedName = editName.trim();
      if (trimmedName) body.name = trimmedName;
      body.bio = editBio.trim() || '';
      if (editAvatarFile) {
        body.avatar = await uploadImage(editAvatarFile);
      }
      return updateProfile(body);
    },

    onMutate: async () => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['myProfile'] });

      // 롤백용 스냅샷 저장
      const previousProfile = queryClient.getQueryData(['myProfile']);
      const previousUserName = userName;

      const trimmedName = editName.trim();
      if (trimmedName) {
        // 쿼리 캐시 즉시 업데이트 (마이페이지 닉네임)
        queryClient.setQueryData(['myProfile'], (old: Record<string, unknown> | undefined) =>
          old ? { ...old, name: trimmedName } : old,
        );
        // NavBar 닉네임 즉시 업데이트
        updateUserName(trimmedName);
      }

      return { previousProfile, previousUserName };
    },

    onError: (err: Error, _vars, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['myProfile'], context.previousProfile);
      }
      if (context?.previousUserName !== undefined) {
        updateUserName(context.previousUserName);
      }
      setEditError(err.message || '프로필 수정에 실패했습니다.');
    },

    onSuccess: (updated) => {
      // 서버 확정값으로 최종 반영
      if (updated.name) updateUserName(updated.name);
      setIsEditing(false);
      setEditAvatarFile(null);
      setPreviewAvatar('');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });


  function startEditing() {
    setEditName(profile?.name ?? userName);
    setEditBio(profile?.bio ?? '');
    setPreviewAvatar(profile?.avatar ?? '');
    setEditAvatarFile(null);
    setEditError('');
    setIsEditing(true);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setEditError('');
    if (!editName.trim()) { setEditError('이름을 입력해주세요.'); return; }
    doUpdate();
  }

  const displayName = profile?.name ?? userName;
  const displayAvatar = profile?.avatar ?? '';

  return (
    <div className="p-6 pb-24 max-w-3xl mx-auto">
      {/* 프로필 섹션 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        {isProfileLoading ? (
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a]" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-[#2a2a2a] rounded" />
              <div className="h-3 w-48 bg-[#2a2a2a] rounded" />
            </div>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 rounded-full bg-[#2a2a2a] overflow-hidden cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity border-2 border-dashed border-[#444]"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewAvatar ? (
                  <img src={previewAvatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-[#666]">👤</span>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <p className="text-xs text-[#555]">클릭하여 사진 변경</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#888]">이름</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={30}
                className="w-full py-2.5 px-3.5 bg-[#111] border border-[#333] rounded-lg text-sm text-white focus:outline-none focus:border-[#ff2d78] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#888]">Bio <span className="text-[#555]">(선택)</span></label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="자기소개를 입력하세요"
                rows={3}
                maxLength={200}
                className="w-full py-2.5 px-3.5 bg-[#111] border border-[#333] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors resize-none"
              />
            </div>

            {editError && (
              <p className="text-xs text-[#ff4d4f] text-center py-2 px-3 bg-[rgba(255,77,79,0.1)] border border-[rgba(255,77,79,0.3)] rounded-lg">
                {editError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-transparent border border-[#333] text-[#aaa] hover:border-[#555] hover:text-white transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#ff2d78] text-white hover:bg-[#e0266a] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isUpdating ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center text-2xl text-[#666]">
              {displayAvatar ? (
                <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : '👤'}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">{displayName}</p>
              {profile?.bio && <p className="text-[#888] text-sm mt-0.5">{profile.bio}</p>}
              {profile?.email && <p className="text-[#555] text-sm mt-0.5">{profile.email}</p>}
            </div>
            <button
              onClick={startEditing}
              className="text-[#555] hover:text-white transition-colors cursor-pointer bg-transparent border-none text-lg leading-none p-1"
              aria-label="프로필 설정"
            >
              ⚙
            </button>
          </div>
        )}
      </div>

      {/* 탭 */}
      <div className="flex border-b border-[#2a2a2a] mb-4">
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-none bg-transparent ${
            tab === 'my'
              ? 'text-white border-b-2 border-[#ff2d78]'
              : 'text-[#555] hover:text-[#aaa]'
          }`}
        >
          내가 게시한 LP
        </button>
        <button
          onClick={() => setTab('liked')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-none bg-transparent ${
            tab === 'liked'
              ? 'text-white border-b-2 border-[#ff2d78]'
              : 'text-[#555] hover:text-[#aaa]'
          }`}
        >
          좋아요한 LP
        </button>

        {/* 정렬 버튼 */}
        <div className="ml-auto flex gap-2 pb-1">
          <button
            onClick={() => setSort('desc')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              sort === 'desc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              sort === 'asc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* LP 목록 */}
      {isLpLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {!isLpLoading && (
        <>
          {lps.length === 0 ? (
            <p className="text-center text-[#555] text-sm py-16">
              {tab === 'my' ? '아직 등록한 LP가 없어요.' : '좋아요한 LP가 없어요.'}
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
              {lps.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 mt-4">
              {Array.from({ length: 3 }).map((_, i) => <LpCardSkeleton key={i} />)}
            </div>
          )}

          <div ref={sentinelRef} className="h-10" />

          {!hasNextPage && lps.length > 0 && (
            <p className="text-center text-[#555] text-xs py-4">모든 LP를 불러왔습니다.</p>
          )}
        </>
      )}

    </div>
  );
}
