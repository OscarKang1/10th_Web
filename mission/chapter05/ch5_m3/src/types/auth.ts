export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
}
