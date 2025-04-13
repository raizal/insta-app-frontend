import { useState } from 'react';
import { submitPost, SubmitPostResponse, createPost, getPosts } from '@/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PaginatedResponse, Post } from '@/types/common';

interface UseSubmitPostReturn {
  isSubmitting: boolean;
  submitPostWithImage: (caption: string, imageFile?: File) => Promise<SubmitPostResponse | null>;
  error: Error | null;
}

export function useSubmitPost(): UseSubmitPostReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const submitPostWithImage = async (caption: string, imageFile?: File): Promise<SubmitPostResponse | null> => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return null;
    }

    if (!caption.trim()) {
      toast.error('Post caption cannot be empty');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Make the API call to submit the post
      const response = await submitPost(caption.trim(), imageFile);

      // TODO: refresh posts

      toast.success('Post created successfully!');
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to create post');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitPostWithImage,
    error,
  };
}

interface PostHook {
  posts: PaginatedResponse<Post>[];
  fetchPosts: (page: number) => Promise<void>;
  fetchMorePosts: () => Promise<void>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
}

export const usePosts = (): PostHook => {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PaginatedResponse<Post>[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (_page: number) => {
    try {
      if (isLoading || isLoadingMore) return;
      setLoading(true);

      if (_page > 1) setLoadingMore(true);

      const response = await getPosts(_page);
      setPage(_page);
      setPosts([...posts, response]);
      setHasMore(response.next_page_url !== null);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchMorePosts = async () => {
    try {
      return fetchPosts(page + 1);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }
  
  return {
    posts,
    fetchPosts,
    fetchMorePosts,
    isLoading,
    isLoadingMore,
    hasMore,
  }
};