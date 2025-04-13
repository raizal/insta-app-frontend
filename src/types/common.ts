export interface WithCsrfToken {
  _token: string;
}

export interface User {
  name: string;
  email: string;
  username: string;
  profile_picture_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Post {
  id: number;
  user_id: number;
  image_url: string;
  caption: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  user: UserInfo;
  is_liked: boolean;
}

export interface UserInfo extends User {
  id: number;
}

export interface PostComment {
  id: number;
  user_id: number;
  post_id: number;
  body: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: UserInfo;
  replies: PostComment[];
}


export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user: UserInfo;
}

export interface UserProfile extends UserInfo {
  followers_count: number;
  following_count: number;
  posts_count: number;
  follow_status?: {
    is_following: boolean;
    is_followed_by: boolean;
  };
}

export interface PostDetail extends Post {
  liked: boolean;
}

export interface ProfileResponse {
  posts: PaginatedResponse<PostDetail>;
  user: UserProfile;
}

export interface ProfileApiResponse extends ApiResponse<ProfileResponse> {}