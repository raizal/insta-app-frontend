import { useState } from 'react';
import { submitPost } from '@/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Post } from '@/types/common';

interface UseSubmitPostReturn {
  isSubmitting: boolean;
  submitPostWithImage: (caption: string, imageFile?: File) => Promise<Post | null>;
  error: Error | null;
}

export function useSubmitPost(): UseSubmitPostReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const submitPostWithImage = async (caption: string, imageFile?: File): Promise<Post | null> => {
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
      return response.data;
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