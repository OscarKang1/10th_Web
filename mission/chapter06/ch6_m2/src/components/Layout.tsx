import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 메인: 데스크탑에서 사이드바 너비만큼 왼쪽 여백 */}
      <main className="pt-14 md:ml-60 min-h-screen">
        {children}
      </main>

      {/* 우측 하단 플로팅 + 버튼 */}
      <button
        onClick={() => isLoggedIn ? navigate('/lp/new') : navigate('/login')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ff2d78] text-white text-3xl font-light flex items-center justify-center shadow-lg hover:bg-[#e0245e] transition-colors z-40 cursor-pointer"
        aria-label="LP 추가"
      >
        +
      </button>
    </div>
  );
}
