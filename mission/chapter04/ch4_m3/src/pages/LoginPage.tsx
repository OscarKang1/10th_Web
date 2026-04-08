import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '../api/authApi';
import useLocalStorage from '../hooks/useLocalStorage';

const BASE_URL = 'http://localhost:8000';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [, setAccessToken] = useLocalStorage<string>('accessToken', '');
  const [, setRefreshToken] = useLocalStorage<string>('refreshToken', '');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError('');
    try {
      const result = await signIn({ email: data.email, password: data.password });
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/v1/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-[380px] flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button
            className="bg-transparent border-none text-[1.75rem] leading-none text-white cursor-pointer p-0 flex items-center hover:opacity-70 transition-opacity"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            &#8249;
          </button>
          <h1 className="text-xl font-bold text-white m-0">로그인</h1>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-[10px] py-[11px] px-4 bg-transparent border border-[#444] rounded-md text-[0.9375rem] font-medium text-white cursor-pointer hover:bg-[#1a1a1a] hover:border-[#666] transition-colors"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          구글 로그인
        </button>

        {/* Divider */}
        <div className="flex items-center gap-[10px] my-1">
          <span className="flex-1 h-px bg-[#333]" />
          <span className="text-xs text-[#666] whitespace-nowrap">OR</span>
          <span className="flex-1 h-px bg-[#333]" />
        </div>

        {/* Form */}
        <form className="flex flex-col gap-[10px]" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1">
            <input
              type="email"
              className={`w-full py-[11px] px-[14px] bg-[#1a1a1a] border rounded-md text-[0.9rem] text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#666] ${errors.email ? 'border-[#ff4d4f]' : 'border-[#333]'}`}
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
            />
            {errors.email && <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="password"
              className={`w-full py-[11px] px-[14px] bg-[#1a1a1a] border rounded-md text-[0.9rem] text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#666] ${errors.password ? 'border-[#ff4d4f]' : 'border-[#333]'}`}
              placeholder="비밀번호를 입력해주세요!"
              {...register('password')}
            />
            {errors.password && <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.password.message}</p>}
          </div>

          {apiError && (
            <p className="text-[0.78rem] text-[#ff4d4f] text-center py-2 px-3 bg-[rgba(255,77,79,0.1)] border border-[rgba(255,77,79,0.3)] rounded-md m-0">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            className={`w-full py-3 border-none rounded-md text-[0.9375rem] font-semibold cursor-pointer transition-colors mt-1 ${
              isValid && !isLoading
                ? 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'
                : 'bg-[#222] text-[#555] cursor-not-allowed'
            }`}
            disabled={!isValid || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default LoginPage;
