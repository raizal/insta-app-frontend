import { useState, useEffect, useCallback } from 'react';
import { fetchPostComments } from '@/services/postService';
import { toast } from 'sonner';
import { Comment, ApiResponse, PaginatedResponse } from '@/types/common';

interface UsePostCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  fetchMoreIsLoading: boolean;
  error: Error | null;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  currentPage: number;
  totalComments: number;
  refreshComments: () => Promise<void>;
}

export function usePostComments(postId: string | number): UsePostCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchMoreIsLoading, setFetchMoreIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = useCallback(async (page: number = 1) => {
    try {
      const response = await fetchPostComments(postId, page);
      return response.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load comments');
      throw error;
    }
  }, [postId]);

  // Function to refresh comments (reset and fetch first page)
  const refreshComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchComments(1);
      console.log(response);
      setComments(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
      setTotalComments(response.total);
    } catch (error) {
      // Error is already handled in fetchComments
    } finally {
      setIsLoading(false);
    }
  }, [fetchComments]);

  // Function to load more comments (next page)
  const fetchMore = useCallback(async () => {
    if (currentPage >= lastPage || fetchMoreIsLoading) {
      return; // No more pages to load or already loading
    }

    setFetchMoreIsLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await fetchComments(nextPage);
      
      // Append new comments to existing ones
      setComments(prevComments => [...prevComments, ...response.data]);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
      setTotalComments(response.total);
    } catch (error) {
      // Error is already handled in fetchComments
    } finally {
      setFetchMoreIsLoading(false);
    }
  }, [currentPage, lastPage, fetchMoreIsLoading, fetchComments]);

  return {
    comments,
    isLoading,
    fetchMoreIsLoading,
    error,
    fetchMore,
    hasMore: currentPage < lastPage,
    currentPage,
    totalComments,
    refreshComments,
  };
} 