import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

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

// 동시에 여러 401이 발생해도 refresh 요청을 한 번만 보내기 위한 전역 Promise
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getStoredToken('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await axios.post(
    `${BASE_URL}/v1/auth/refresh`,
    { refresh: refreshToken }
  );

  const newAccessToken: string = data.data.accessToken;
  const newRefreshToken: string | undefined = data.data.refreshToken;

  setStoredToken('accessToken', newAccessToken);
  if (newRefreshToken) {
    setStoredToken('refreshToken', newRefreshToken);
  }

  window.dispatchEvent(
    new CustomEvent('auth:tokenRefreshed', {
      detail: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken ?? getStoredToken('refreshToken'),
      },
    })
  );

  return newAccessToken;
};

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredToken('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 진행 중인 갱신 요청이 있으면 새로 보내지 않고 기존 Promise를 공유
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
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
