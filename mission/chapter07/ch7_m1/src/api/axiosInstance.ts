import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem('accessToken');
  const token = raw ? (JSON.parse(raw) as string) : '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 응답 시 리프레시 토큰으로 자동 재발급
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const raw = localStorage.getItem('refreshToken');
        const refreshToken = raw ? (JSON.parse(raw) as string) : '';

        if (!refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken: string = data.data.accessToken;
        localStorage.setItem('accessToken', JSON.stringify(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
