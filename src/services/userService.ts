import axios from "@/lib/axios";
import { ApiResponse } from "@/types/common";

interface ToggleFollowResponse {
  is_following: boolean;
}

interface ProfilePictureResponse {
  profile_picture: string;
  profile_picture_url: string;
}

export const toggleFollow = async (username: string): Promise<ApiResponse<ToggleFollowResponse>> => {
  try {
    const response = await axios.post<ApiResponse<ToggleFollowResponse>>(
      `/web/users/${username}/toggle-follow`,
      {},
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error toggling follow status for ${username}:`, error);
    throw error;
  }
};

export const updateProfilePicture = async (file: File): Promise<ApiResponse<ProfilePictureResponse>> => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.post<ApiResponse<ProfilePictureResponse>>(
      '/web/profile/picture',
      formData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}; 