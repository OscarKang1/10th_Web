export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}
