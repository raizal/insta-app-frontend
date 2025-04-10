
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPosts, Post as PostType } from "@/services/postService";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const POSTS_PER_PAGE = 5;

const Feed = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const { user } = useAuth();
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPosts = async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      
      // Convert string dates to Date objects
      const postsWithDates = fetchedPosts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        comments: post.comments.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      }));
      
      const start = 0;
      const end = pageNum * POSTS_PER_PAGE;
      const paginatedPosts = postsWithDates.slice(start, end);
      
      setHasMore(paginatedPosts.length < fetchedPosts.length);
      
      if (refresh) {
        if (JSON.stringify(paginatedPosts) !== JSON.stringify(posts.slice(0, end))) {
          setPosts(paginatedPosts);
          toast.success("Feed refreshed!");
        } else {
          toast.info("No new posts available");
        }
        setNewPostsAvailable(false);
        setRefreshing(false);
      } else {
        setPosts(paginatedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (refresh) {
        toast.error("Failed to refresh feed");
        setRefreshing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkForNewPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      if (fetchedPosts.length > posts.length) {
        setNewPostsAvailable(true);
      }
    } catch (error) {
      console.error("Error checking for new posts:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(page, true);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    // Check for new posts every 30 seconds
    const interval = setInterval(() => {
      checkForNewPosts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [posts.length]);

  if (loading && posts.length === 0) {
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
      
      {posts.length > 0 ? (
        <>
          {posts.map((post, index) => {
            if (posts.length === index + 1 && !loading) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <Post post={post} onPostUpdated={() => fetchPosts(page, true)} />
                </div>
              );
            } else {
              return <Post key={post.id} post={post} onPostUpdated={() => fetchPosts(page, true)} />;
            }
          })}
          
          {/* Loading indicator at bottom */}
          {loading && posts.length > 0 && (
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
