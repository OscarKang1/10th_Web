import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

function Navbar() {
  const navigate = useNavigate();
  const [accessToken, , removeAccessToken] = useLocalStorage<string>('accessToken', '');

  const handleLogout = () => {
    removeAccessToken();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#111] flex items-center justify-between px-6 z-100 border-b border-[#222]">
      <span
        className="text-[1.1rem] font-bold text-[#ff2d78] cursor-pointer tracking-tight"
        onClick={() => navigate('/')}
      >
        돌려돌려LP판
      </span>
      <div className="flex gap-2 items-center">
        {accessToken ? (
          <button
            className="px-[14px] py-[6px] rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 bg-transparent border border-[#555] text-white"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <>
            <button
              className="px-[14px] py-[6px] rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 bg-transparent border border-[#555] text-white"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
            <button
              className="px-[14px] py-[6px] rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 bg-[#ff2d78] border border-[#ff2d78] text-white"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
