import { useState } from 'react';
import UserCard from './components/UserCard';
import './App.css';

const BASE = 'https://jsonplaceholder.typicode.com/users';

export default function App() {
  const [userId, setUserId] = useState(1);
  const [show, setShow] = useState(true);
  const [errorMode, setErrorMode] = useState(false);

  const url = errorMode ? `${BASE}/99999` : `${BASE}/${userId}`;

  const handleNextUser = () => {
    setUserId((id) => (id % 10) + 1);
    setErrorMode(false);
  };

  return (
    <div className="app">
      <div className="controls">
        <button onClick={handleNextUser}>다른 사용자 불러오기</button>
        <button onClick={() => setShow((v) => !v)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button
          className={errorMode ? 'btn-error-active' : 'btn-error'}
          onClick={() => setErrorMode((v) => !v)}
        >
          랜덤도 테스트 (404 에러)
        </button>
      </div>

      {show ? (
        <UserCard url={url} />
      ) : (
        <div className="user-card state-card unmounted">
          컴포넌트가 언마운트 되었습니다.
          <br />
          <span>다시 토글하면 캐시에서 즉시 불러옵니다 (10초 이내)</span>
        </div>
      )}
    </div>
  );
}
