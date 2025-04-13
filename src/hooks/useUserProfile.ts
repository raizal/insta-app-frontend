import { useState, useEffect, useCallback } from 'react';
import { getUserPosts } from '@/services/postService';
import { toggleFollow } from '@/services/userService';
import { ProfileResponse, PostDetail, UserProfile } from '@/types/common';
import { toast } from 'sonner';

interface UseUserProfileReturn {
  profileData: ProfileResponse | null;
  posts: PostDetail[];
  user: UserProfile | null;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  currentPage: number;
  followLoading: boolean;
  toggleFollowStatus: () => Promise<void>;
}

export const useUserProfile = (username: string): UseUserProfileReturn => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUserProfile = useCallback(async (page: number, shouldRefresh: boolean = false) => {
    try {
      if (shouldRefresh) {
        setRefreshing(true);
      } else if (page > 1) {
        setLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getUserPosts(username, page);
      
      if (response.success) {
        const { data } = response;
        
        // If it's the first page or a refresh, replace everything
        if (page === 1 || shouldRefresh) {
          setPosts(data.posts.data);
          setUser(data.user);
          setProfileData(data);
        } else {
          // Otherwise append the new posts
          setPosts(prevPosts => [...prevPosts, ...data.posts.data]);
        }
        
        setHasMore(data.posts.next_page_url !== null);
        setCurrentPage(page);
        
        if (shouldRefresh && page === 1) {
          toast.success("Profile refreshed!");
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (shouldRefresh) {
        toast.error("Failed to refresh profile");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [username]);

  const loadMore = async () => {
    if (loading || refreshing || !hasMore) return;
    await fetchUserProfile(currentPage + 1);
  };

  const refreshProfile = async () => {
    await fetchUserProfile(1, true);
  };

  const toggleFollowStatus = async () => {
    if (!user || followLoading) return;
    
    setFollowLoading(true);
    try {
      const response = await toggleFollow(username);
      
      if (response.success) {
        // Update the user's follow status
        setUser(prevUser => {
          if (!prevUser) return null;
          
          return {
            ...prevUser,
            follow_status: {
              ...prevUser.follow_status,
              is_following: response.data.is_following
            },
            // Update followers count
            followers_count: response.data.is_following 
              ? prevUser.followers_count + 1 
              : Math.max(0, prevUser.followers_count - 1)
          };
        });

        toast.success(
          response.data.is_following 
            ? `You are now following @${username}` 
            : `You unfollowed @${username}`
        );
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(1);
  }, [fetchUserProfile]);

  return {
    profileData,
    posts,
    user,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refreshProfile,
    currentPage,
    followLoading,
    toggleFollowStatus
  };
}; 