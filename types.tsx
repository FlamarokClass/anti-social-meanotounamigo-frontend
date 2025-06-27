export interface Post {
  _id: string;
  description: string;
  tags?: string[];
  images?: { url: string }[];
  comments?: { content: string }[];
}

export interface User {
  _id: string;
  nickName: string;
}