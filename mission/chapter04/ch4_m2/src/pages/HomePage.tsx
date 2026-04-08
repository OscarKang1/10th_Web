import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] pt-14">
      <h1 className="text-2xl text-white">홈 화면</h1>
      <button
        onClick={() => navigate('/login')}
        className="px-8 py-3 bg-[#ff2d78] text-white border-none rounded-lg text-base font-semibold cursor-pointer"
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
}

export default HomePage;
