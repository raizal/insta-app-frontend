import { useState } from 'react';
import { submitComment as submitCommentService } from '@/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Comment } from '@/types/common';

interface SubmitCommentReturn {
  isSubmitting: boolean;
  submitComment: (postId: string | number, comment: string) => Promise<Comment | null>;
  error: Error | null;
}

export function useSubmitComment(): SubmitCommentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const submitComment = async (postId: number, comment: string): Promise<Comment | null> => {
    if (!user) {
      toast.error('You must be logged in to create a comment');
      return null;
    }

    if (!comment.trim()) {
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Make the API call to submit the post
      const response = await submitCommentService(postId, comment);

      toast.success('Comment created successfully!');
      return response.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to create comment');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitComment,
    error,
  };
} 