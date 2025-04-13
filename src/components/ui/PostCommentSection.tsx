import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePostComments } from "@/hooks/usePostComments";
import { useSubmitComment } from "@/hooks/useSubmitComment";
import { Comment } from "@/types/common";

interface PostCommentSectionProps {
  postId: number;
  commentsCount: number;
  onCommentAdded?: () => void | Promise<void>;
  visible: boolean;
  onToggleVisibility: () => void;
}

const PostCommentSection = ({ 
  postId, 
  commentsCount, 
  onCommentAdded, 
  visible, 
  onToggleVisibility 
}: PostCommentSectionProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { submitComment, isSubmitting: isSubmittingComment } = useSubmitComment();
  const {
    comments, 
    refreshComments, 
    isLoading, 
    fetchMore, 
    hasMore, 
    currentPage, 
    totalComments
  } = usePostComments(postId);

  // Effect to load comments when they're first shown
  const commentsLoadedRef = useRef(false);
  
  // Load comments if they haven't been loaded yet and section is now visible
  if (visible && !commentsLoadedRef.current) {
    refreshComments();
    commentsLoadedRef.current = true;
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await submitComment(postId, comment.trim());
      setComment("");
      refreshComments();
      if (onCommentAdded) await onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loadMoreComments = () => {
    fetchMore();
  };

  const renderComments = useMemo(() => {
    const visibleComments = comments;
    const hasMoreComments = hasMore;
    
    return (
      <>
        {(visibleComments || []).map((comment, index) => (
          <div key={index} className="flex items-start gap-2 py-2 mb-2">
            <Avatar className="h-6 w-6">
              {comment.user.profile_picture_url && <AvatarImage src={comment.user.profile_picture_url} alt={comment.user.username} />}
              {!comment.user.profile_picture_url && <AvatarFallback>{comment.user.name[0].toUpperCase()}</AvatarFallback>}
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center">
                  <Link to={`/profile/${comment.user.username || comment.user.name}`} className="font-medium text-sm mr-1">
                    {comment.user.username}
                  </Link>
                  <span className="text-sm">{comment.body}</span>
                </div>
                <span className="text-xs text-gray-500 mt-0.5">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {hasMoreComments && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadMoreComments}
            className="text-sm text-sevima-blue flex items-center mx-auto mt-1"
          >
            Load more comments <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        )}
      </>
    );
  }, [comments, hasMore]);

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Comments section */}
      <div className="border-t px-4 py-2">
        {isLoading && comments.length === 0 ? (
          <div className="py-2 flex justify-center">
            <div className="animate-pulse flex items-center gap-1">
              <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
              <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
              <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
            </div>
          </div>
        ) : comments.length > 0 ? (
          renderComments
        ) : (
          <p className="text-sm text-gray-500 py-2">No comments yet</p>
        )}
      </div>

      {/* Add comment form */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="flex items-center border-t p-3">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-h-[40px] max-h-[80px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.shiftKey) {
                  // Shift+Enter: allow normal behavior (new line)
                  return;
                } else {
                  // Enter alone: submit the form
                  e.preventDefault();
                  if (comment.trim() && !isSubmittingComment) {
                    handleCommentSubmit(e as unknown as React.FormEvent);
                  }
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!comment.trim() || isSubmittingComment}
            className="text-instagram-blue"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send comment</span>
          </Button>
        </form>
      )}
    </>
  );
};

export default PostCommentSection; 