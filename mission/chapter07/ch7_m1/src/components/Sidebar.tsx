import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../api/userApi';
import ConfirmModal from './ConfirmModal';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: '홈', path: '/' },
  { label: '마이페이지', path: '/my' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userName, logout } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const { mutate: doWithdraw, isPending: isWithdrawing } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout();
      navigate('/login');
      onClose();
    },
    onError: () => {
      // 실패해도 로컬 상태 정리 후 이동
      logout();
      navigate('/login');
      onClose();
    },
  });

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-14 left-0 h-[calc(100vh-56px)] w-60 bg-[#111] border-r border-[#222]
          flex flex-col pt-6 px-3 z-40
          transition-transform duration-200
          md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {isLoggedIn && (
          <div className="px-3 py-3 mb-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
            <p className="text-xs text-[#666] mb-1">로그인됨</p>
            <p className="text-sm font-semibold text-white truncate">{userName}님</p>
          </div>
        )}

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${location.pathname === item.path
                  ? 'bg-[#ff2d78]/20 text-[#ff2d78]'
                  : 'text-[#aaa] hover:bg-[#1a1a1a] hover:text-white'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {isLoggedIn && (
          <div className="pb-6 px-1">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={isWithdrawing}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#555] hover:text-[#ff4d4f] hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-50"
            >
              탈퇴하기
            </button>
          </div>
        )}
      </aside>

      {showWithdrawModal && (
        <ConfirmModal
          message={'정말 탈퇴하시겠어요?\n이 작업은 되돌릴 수 없습니다.'}
          confirmLabel="예"
          cancelLabel="아니오"
          danger
          onConfirm={() => { setShowWithdrawModal(false); doWithdraw(); }}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
}
