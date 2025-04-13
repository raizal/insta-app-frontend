
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";
import { Post as PostType } from "@/types/common";
const POSTS_PER_PAGE = 5;

const Feed = () => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  const { posts, fetchPosts, fetchMorePosts, isLoading, isLoadingMore, hasMore } = usePosts();
  const normalizedPosts = useMemo(() => {
    return posts.map((paging) => paging.data).flat();
  }, [posts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMorePosts();
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (isLoading && !isLoadingMore && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20">
      {/* Pull to refresh button */}
      <div className="sticky top-0 z-10 flex justify-center py-2">
        {newPostsAvailable && (
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-white text-sevima-blue shadow-md flex items-center gap-1"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'New posts available'}
          </Button>
        )}
      </div>
      
      {normalizedPosts.length > 0 ? (
        <>
          {normalizedPosts.map((post, index) => {
            if (normalizedPosts.length === index + 1 && !isLoading) {
              return (
                <div
                  // ref={lastPostRef}
                  key={post.id}>
                  <Post post={post} />
                </div>
              );
            } else {
              return <Post key={post.id} post={post} />;
            }
          })}
          
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button onClick={() => fetchMorePosts()}>Load more</Button>
            </div>
          )}

          {/* Loading indicator at bottom */}
          {isLoadingMore && posts.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
                <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
                <div className="h-2 w-2 bg-sevima-blue rounded-full"></div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-md shadow border p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-gray-600">
            Follow users or create your first post to see content here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
