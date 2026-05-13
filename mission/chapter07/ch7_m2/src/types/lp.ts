export interface LpAuthor {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface LpTag {
  id: number;
  name: string;
}

export interface LpLike {
  id: number;
  userId: number;
  lpId: number;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LpLike[];
  author?: LpAuthor;
}

export type SortOrder = 'desc' | 'asc';

export interface LpListResponse {
  data: Lp[];
  nextCursor: number;
  hasNext: boolean;
}

export interface LpComment {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface CommentListResponse {
  data: LpComment[];
  nextCursor: number;
  hasNext: boolean;
}

export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published?: boolean;
}

export interface UpdateLpRequest {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}
