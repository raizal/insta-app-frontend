import { usePostComments } from "@/hooks/usePostComments";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCommentsListProps {
  postId: string | number;
}

export function PostCommentsList({ postId }: PostCommentsListProps) {
  const {
    comments,
    isLoading,
    fetchMoreIsLoading,
    error,
    fetchMore,
    hasMore,
    totalComments
  } = usePostComments(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load comments. Please try again.
      </div>
    );
  }

  if (comments.length === 0) {
    return <div className="text-center py-4 text-gray-500">No comments yet</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-600">
        {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
      </h3>
      
      <ul className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              {comment.user.profile_picture_url ? (
                <img
                  src={comment.user.profile_picture_url}
                  alt={comment.user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="rounded-lg bg-gray-100 px-3 py-2">
                <div className="font-medium text-sm">{comment.user.name}</div>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMore}
            disabled={fetchMoreIsLoading}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {fetchMoreIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load more comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 