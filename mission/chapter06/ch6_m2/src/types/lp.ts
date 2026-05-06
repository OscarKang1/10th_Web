export interface LpAuthor {
  id: number;
  name: string;
  email: string;
  avatar: string;
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
  tags: string[];
  likes: unknown[];
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
