import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, type UserProfile } from '../api/authApi';

function HomePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch {
      setError('프로필 조회에 실패했습니다. (토큰이 갱신되지 않았을 수 있어요)');
    } finally {
      setLoading(false);
    }
  };

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

      {/* 내 정보 조회 버튼 — Access Token 만료 시 자동 갱신 테스트용 */}
      <button
        onClick={handleFetchProfile}
        disabled={loading}
        style={{
          padding: '12px 32px',
          backgroundColor: '#1e6bff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? '조회 중...' : '내 정보 조회 (토큰 갱신 테스트)'}
      </button>

      {profile && (
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '20px 32px',
            color: '#fff',
            lineHeight: 1.8,
            minWidth: '280px',
          }}
        >
          <p style={{ margin: 0 }}>이름: <strong>{profile.name}</strong></p>
          <p style={{ margin: 0 }}>이메일: <strong>{profile.email}</strong></p>
          <p style={{ margin: 0 }}>ID: <strong>{profile.id}</strong></p>
        </div>
      )}

      {error && (
        <p style={{ color: '#ff4d4f', fontSize: '0.875rem', margin: 0 }}>{error}</p>
      )}

      <button
        onClick={logout}
        style={{
          padding: '12px 32px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default HomePage;
