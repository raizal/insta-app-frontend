import axios from "@/lib/axios";
import { ApiResponse } from "@/types/common";

interface ToggleFollowResponse {
  is_following: boolean;
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