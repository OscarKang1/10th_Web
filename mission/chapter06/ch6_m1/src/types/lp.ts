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
