export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};
