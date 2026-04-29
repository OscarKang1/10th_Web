import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// localStorage에서 JSON으로 직렬화된 토큰 값을 읽어오는 헬퍼
const getStoredToken = (key: string): string | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setStoredToken = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// 요청 인터셉터: 모든 요청에 Access Token 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredToken('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 응답 시 Refresh Token으로 Access Token 재발급 후 재요청
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // _retry 플래그로 무한 재시도 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getStoredToken('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // 새로운 axios 인스턴스로 재발급 요청 (인터셉터 순환 방지)
        const { data } = await axios.post(
          `${BASE_URL}/v1/auth/token/access`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const newAccessToken: string = data.accessToken;
        const newRefreshToken: string | undefined = data.refreshToken;

        // localStorage에 새 토큰 저장
        setStoredToken('accessToken', newAccessToken);
        if (newRefreshToken) {
          setStoredToken('refreshToken', newRefreshToken);
        }

        // AuthContext에 토큰 갱신 알림 (React 상태 동기화)
        window.dispatchEvent(
          new CustomEvent('auth:tokenRefreshed', {
            detail: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken ?? getStoredToken('refreshToken'),
            },
          })
        );

        // 실패했던 원래 요청을 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // Refresh Token도 만료된 경우: 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth:logout'));
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
