import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: '#0a0a0a',
        paddingTop: '56px',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', color: '#fff' }}>홈 화면</h1>
      <button
        onClick={() => navigate('/login')}
        style={{
          padding: '12px 32px',
          backgroundColor: '#ff2d78',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
}

export default HomePage;
