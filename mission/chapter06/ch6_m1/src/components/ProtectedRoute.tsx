import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(!isLoggedIn);

  if (isLoggedIn) return <>{children}</>;

  if (!showModal) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 max-w-sm w-full text-center">
        <p className="text-white text-lg font-semibold mb-2">로그인이 필요해요</p>
        <p className="text-[#888] text-sm mb-6">이 페이지는 로그인 후 이용할 수 있어요.</p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2 rounded-md text-sm font-semibold bg-transparent border border-[#555] text-white hover:opacity-80 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            돌아가기
          </button>
          <button
            className="px-5 py-2 rounded-md text-sm font-semibold bg-[#ff2d78] text-white hover:opacity-80 cursor-pointer"
            onClick={() => {
              setShowModal(false);
              navigate('/login', { state: { from: location.pathname } });
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
