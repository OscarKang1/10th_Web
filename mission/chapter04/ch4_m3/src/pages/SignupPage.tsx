import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '../api/authApi';
import useLocalStorage from '../hooks/useLocalStorage';

const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    nickname: z.string().min(1, '닉네임을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [, setAccessToken] = useLocalStorage<string>('accessToken', '');
  const [, setRefreshToken] = useLocalStorage<string>('refreshToken', '');

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const handleNextStep1 = async () => {
    const valid = await trigger('email');
    if (valid) setStep(2);
  };

  const handleNextStep2 = async () => {
    const valid = await trigger(['password', 'confirmPassword']);
    if (valid) setStep(3);
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setApiError('');
    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        passwordCheck: data.confirmPassword,
        name: data.nickname,
      });
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full py-[11px] px-[14px] bg-[#1a1a1a] border rounded-md text-[0.9rem] text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#666]';
  const inputNormal = `${inputBase} border-[#333]`;
  const inputError = `${inputBase} border-[#ff4d4f]`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-[380px] flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-4 mb-1">
          <button
            type="button"
            className="bg-transparent border-none text-[1.75rem] leading-none text-white cursor-pointer p-0 flex items-center hover:opacity-70 transition-opacity"
            onClick={() => (step === 1 ? navigate(-1) : setStep((s) => (s - 1) as 1 | 2 | 3))}
            aria-label="뒤로 가기"
          >
            &#8249;
          </button>
          <h1 className="text-xl font-bold text-white m-0">회원가입</h1>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-1">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`w-2 h-2 rounded-full transition-colors ${step >= n ? 'bg-white' : 'bg-[#333]'}`}
            />
          ))}
        </div>

        <form className="flex flex-col gap-[10px]" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step 1: 이메일 */}
          {step === 1 && (
            <>
              <p className="text-[0.9rem] text-[#aaa] m-0 mb-1">이메일을 입력해주세요</p>
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  className={errors.email ? inputError : inputNormal}
                  placeholder="이메일을 입력해주세요!"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.email.message}</p>
                )}
              </div>
              <button
                type="button"
                className="w-full py-3 mt-1 border-none rounded-md text-[0.9375rem] font-semibold bg-[#3a3a3a] text-white cursor-pointer hover:bg-[#4a4a4a] transition-colors"
                onClick={handleNextStep1}
              >
                다음
              </button>
            </>
          )}

          {/* Step 2: 비밀번호 */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-[10px] py-[10px] px-[14px] bg-[#1a1a1a] border border-[#333] rounded-md mb-2">
                <span className="text-[0.78rem] text-[#666] whitespace-nowrap">이메일</span>
                <span className="text-[0.9rem] text-white overflow-hidden text-ellipsis whitespace-nowrap">
                  {getValues('email')}
                </span>
              </div>
              <p className="text-[0.9rem] text-[#aaa] m-0 mb-1">비밀번호를 설정해주세요</p>
              <div className="flex flex-col gap-1">
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${errors.password ? inputError : inputNormal} pr-[42px]`}
                    placeholder="비밀번호를 입력해주세요!"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bg-transparent border-none text-[#666] cursor-pointer p-0 flex items-center hover:text-[#aaa] transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="비밀번호 보기 토글"
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="relative flex items-center">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`${errors.confirmPassword ? inputError : inputNormal} pr-[42px]`}
                    placeholder="비밀번호를 다시 입력해주세요!"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bg-transparent border-none text-[#666] cursor-pointer p-0 flex items-center hover:text-[#aaa] transition-colors"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="비밀번호 확인 보기 토글"
                  >
                    {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="button"
                className="w-full py-3 mt-1 border-none rounded-md text-[0.9375rem] font-semibold bg-[#3a3a3a] text-white cursor-pointer hover:bg-[#4a4a4a] transition-colors"
                onClick={handleNextStep2}
              >
                다음
              </button>
            </>
          )}

          {/* Step 3: 닉네임 */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-[10px] py-[10px] px-[14px] bg-[#1a1a1a] border border-[#333] rounded-md mb-2">
                <span className="text-[0.78rem] text-[#666] whitespace-nowrap">이메일</span>
                <span className="text-[0.9rem] text-white overflow-hidden text-ellipsis whitespace-nowrap">
                  {getValues('email')}
                </span>
              </div>
              <p className="text-[0.9rem] text-[#aaa] m-0 mb-1">닉네임을 설정해주세요</p>
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-[72px] h-[72px] rounded-full bg-[#2a2a2a] border-2 border-dashed border-[#444] flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#555">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="text-[0.78rem] text-[#555]">프로필 이미지 (선택)</span>
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  className={errors.nickname ? inputError : inputNormal}
                  placeholder="닉네임을 입력해주세요!"
                  {...register('nickname')}
                />
                {errors.nickname && (
                  <p className="text-[0.78rem] text-[#ff4d4f] m-0 pl-[2px]">{errors.nickname.message}</p>
                )}
              </div>
              {apiError && (
                <p className="text-[0.78rem] text-[#ff4d4f] text-center py-2 px-3 bg-[rgba(255,77,79,0.1)] border border-[rgba(255,77,79,0.3)] rounded-md m-0">
                  {apiError}
                </p>
              )}
              <button
                type="submit"
                className={`w-full py-3 mt-1 border-none rounded-md text-[0.9375rem] font-semibold transition-colors ${
                  isLoading
                    ? 'bg-[#222] text-[#555] cursor-not-allowed'
                    : 'bg-[#3a3a3a] text-white cursor-pointer hover:bg-[#4a4a4a]'
                }`}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '회원가입 완료'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default SignupPage;
