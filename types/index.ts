export interface Community {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  createdBy: string;
  threads: string[];
  members: string[];
}

export interface Author {
  _id: string;
  id: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  communities: string[];
  likedPosts: string[];
  onboarded: boolean;
  threads: string[];
}

export interface Post {
  _id: string;
  text: string;
  author: Author;
  parentId: string;
  community: Community;
  children: Post[];
  likes: string[];
  createdAt: string;
}
