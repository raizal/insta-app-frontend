import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post as PostType } from "@/types/common";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { likePost } from "@/services/postService";
import PostCommentSection from "@/components/ui/PostCommentSection";

interface PostProps {
  post: PostType;
  onPostUpdated?: () => void | Promise<void>;
}

const Post = ({ post, onPostUpdated }: PostProps) => {
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    try {
      const {liked, likeCount} = await likePost(post.id);
      setIsLiked(liked);
      setLikesCount(likeCount);
      if (onPostUpdated) await onPostUpdated();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  // Format date to "X days/hours/minutes ago"
  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });

  return (
    <div className="bg-white rounded-md shadow border mb-4">
      {/* Post header */}
      <div className="flex items-center p-4">
        <Avatar className="h-8 w-8">
          {post.user.profile_picture_url && <AvatarImage src={post.user.profile_picture_url} alt={post.user.username} />}
          {!post.user.profile_picture_url && <AvatarFallback>{post.user.name[0].toUpperCase()}</AvatarFallback>}
        </Avatar>
        <div className="ml-3 flex-1">
          <Link to={`/profile/${post.user.username}`} className="font-medium">
            @{post.user.username}
          </Link>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/* Post image if exists */}
      {post.image_url && (
        <div className="relative pb-[75%]">
          <img
            src={post.image_url}
            alt="Post"
            className="absolute inset-0 h-full w-full object-contain bg-gray-700"
          />
        </div>
      )}

      {/* Post content */}
      <div className="p-4 text-sm">
        <p>{post.caption}</p>
      </div>

      {/* Post actions */}
      <div className="flex items-center px-4 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center ${isLiked ? "text-instagram-red" : ""}`}
        >
          <Heart
            className={`h-5 w-5 mr-1 ${isLiked ? "fill-instagram-red text-instagram-red" : ""}`}
          />
          <span>{likesCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleComments}
          className="flex items-center ml-2"
        >
          <MessageCircle className="h-5 w-5 mr-1" />
          <span>{post.comments_count}</span>
        </Button>
      </div>

      {/* Comment section using the new component */}
      <PostCommentSection 
        postId={post.id}
        commentsCount={post.comments_count}
        onCommentAdded={onPostUpdated}
        visible={showComments}
        onToggleVisibility={toggleComments}
      />
    </div>
  );
};

export default Post;
