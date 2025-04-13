import { toast } from "sonner";
import { AxiosResponse } from "axios";
import axios from "@/lib/axios";
import { ApiResponse, PaginatedResponse, Post, Comment, ProfileApiResponse } from "@/types/common";

interface LikePostResponse {
  liked: boolean;
  likeCount: number;
}

export const getPosts = async (page: number = 1): Promise<PaginatedResponse<Post>> => {
  const response = await axios.get<ApiResponse<PaginatedResponse<Post>>>('/web/posts', {
    params: { page, per_page: 2 },
    withCredentials: true,
  });
  return response.data.data;
};

export const likePost = async (postId: number): Promise<LikePostResponse> => {
  const response = await axios.post<LikePostResponse>(`/web/posts/${postId}/like`, {}, {
    withCredentials: true,
  });
  return response.data;
}

export const submitComment = async (postId: number, comment: string): Promise<ApiResponse<Comment>> => {
  const response = await axios.post<ApiResponse<Comment>>(`/web/posts/${postId}/comment`, { body: comment }, {
    withCredentials: true,
  });
  return response.data;
}

export const fetchPostComments = async (postId: string | number, page: number = 1): Promise<ApiResponse<PaginatedResponse<Comment>>> => {
  try {
    const response = await axios.get(`/web/posts/${postId}/comments`, {
      params: { page },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

export const submitPost = async (caption: string, imageFile?: File): Promise<ApiResponse<Post>> => {
  try {
    const formData = new FormData();
    formData.append('caption', caption);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await axios.post<ApiResponse<Post>>('/web/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting post:", error);
    throw error;
  }
};

export const getUserPosts = async (username: string, page: number = 1, perPage: number = 6): Promise<ProfileApiResponse> => {
  try {
    const response = await axios.get<ProfileApiResponse>(`/web/users/${username}/posts`, {
      params: { page, per_page: perPage },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${username}:`, error);
    throw error;
  }
};
