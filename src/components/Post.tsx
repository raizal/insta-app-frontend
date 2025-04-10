
import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post as PostType, Comment, likePost, addComment } from "@/services/postService";
import { Heart, MessageCircle, Send, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
  post: PostType;
  onPostUpdated: () => void;
}

const COMMENTS_PER_PAGE = 3;

const Post = ({ post, onPostUpdated }: PostProps) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(COMMENTS_PER_PAGE);
  
  const hasLiked = user ? post.likes.includes(user.id) : false;

  const handleLike = async () => {
    if (!user) return;
    try {
      await likePost(post.id, user.id);
      onPostUpdated();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(post.id, {
        userId: user.id,
        username: user.username,
        userProfilePic: user.profilePicture,
        content: comment.trim(),
      });
      setComment("");
      onPostUpdated();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to "X days/hours/minutes ago"
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  
  const loadMoreComments = () => {
    setCommentsToShow(prevCount => prevCount + COMMENTS_PER_PAGE);
  };

  const renderComments = (comments: Comment[]) => {
    const visibleComments = comments.slice(0, commentsToShow);
    const hasMoreComments = comments.length > commentsToShow;
    
    return (
      <>
        {visibleComments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2 py-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={comment.userProfilePic} alt={comment.username} />
              <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${comment.username}`} className="font-medium text-sm">
                  {comment.username}
                </Link>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
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
  };

  return (
    <div className="bg-white rounded-md shadow border mb-4">
      {/* Post header */}
      <div className="flex items-center p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.userProfilePic} alt={post.username} />
          <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <Link to={`/profile/${post.username}`} className="font-medium">
            {post.username}
          </Link>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/* Post image if exists */}
      {post.image && (
        <div className="relative pb-[75%]">
          <img
            src={post.image}
            alt="Post"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      {/* Post content */}
      <div className="p-4">
        <p>{post.content}</p>
      </div>

      {/* Post actions */}
      <div className="flex items-center px-4 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center ${hasLiked ? "text-instagram-red" : ""}`}
        >
          <Heart
            className={`h-5 w-5 mr-1 ${hasLiked ? "fill-instagram-red text-instagram-red" : ""}`}
          />
          <span>{post.likes.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center ml-2"
        >
          <MessageCircle className="h-5 w-5 mr-1" />
          <span>{post.comments.length}</span>
        </Button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t px-4 py-2">
          {post.comments.length > 0 ? (
            renderComments(post.comments)
          ) : (
            <p className="text-sm text-gray-500 py-2">No comments yet</p>
          )}
        </div>
      )}

      {/* Add comment form */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="flex items-center border-t p-3">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 min-h-[40px] max-h-[80px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!comment.trim() || isSubmitting}
            className="text-instagram-blue"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send comment</span>
          </Button>
        </form>
      )}
    </div>
  );
};

export default Post;
