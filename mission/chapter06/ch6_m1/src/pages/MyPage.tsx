import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-6 pb-20 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">마이페이지</h1>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl text-[#666]">
            👤
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{userName}</p>
            <p className="text-[#666] text-sm">회원</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl text-sm font-semibold bg-transparent border border-[#333] text-[#aaa] hover:border-[#555] hover:text-white transition-colors cursor-pointer"
      >
        로그아웃
      </button>
    </div>
  );
}
