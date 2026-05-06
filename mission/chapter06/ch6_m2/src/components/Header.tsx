import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        {/* 햄버거 버튼: 모바일에서만 표시 */}
        <button
          className="md:hidden text-white p-1"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
        >
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
          </svg>
        </button>

        <span
          className="text-[1.1rem] font-bold text-[#ff2d78] cursor-pointer tracking-tight"
          onClick={() => navigate('/')}
        >
          돌려돌려LP판
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-[#ccc] hidden sm:block">
              {userName}님 반갑습니다.
            </span>
            <button
              className="px-3 py-[6px] rounded-md text-sm font-semibold bg-transparent border border-[#555] text-white hover:opacity-80 transition-opacity cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-[6px] rounded-md text-sm font-semibold bg-transparent border border-[#555] text-white hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
            <button
              className="px-3 py-[6px] rounded-md text-sm font-semibold bg-[#ff2d78] border border-[#ff2d78] text-white hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
