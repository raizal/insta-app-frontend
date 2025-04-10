
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPosts, Post as PostType } from "@/services/postService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const POSTS_PER_PAGE = 5;

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const isCurrentUser = user?.username === username;
  
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

  const fetchUserPosts = async (pageNum: number, refresh: boolean = false) => {
    try {
      setLoading(true);
      // In a real app, we would fetch user profile data here too
      if (user) {
        const fetchedPosts = await getUserPosts(user.id);
        
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
            toast.success("Profile refreshed!");
          } else {
            toast.info("No new posts available");
          }
          setRefreshing(false);
        } else {
          setPosts(paginatedPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      if (refresh) {
        toast.error("Failed to refresh profile");
        setRefreshing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserPosts(page, true);
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, username, page]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20">
      <div className="bg-white rounded-md shadow border mb-6">
        <div className="p-6 flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.profilePicture} alt={username} />
            <AvatarFallback className="text-2xl">{username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mt-4">{username}</h1>
          <div className="flex space-x-4 mt-4">
            <div className="text-center">
              <span className="font-bold">{posts.length}</span>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <span className="font-bold">0</span>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <span className="font-bold">0</span>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
          
          {/* Refresh button */}
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="mt-4 text-sevima-blue flex items-center gap-1"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh posts'}
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {posts.length > 0 ? (
        <>
          {posts.map((post, index) => {
            if (posts.length === index + 1 && !loading) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <Post post={post} onPostUpdated={() => fetchUserPosts(page, true)} />
                </div>
              );
            } else {
              return <Post key={post.id} post={post} onPostUpdated={() => fetchUserPosts(page, true)} />;
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
          {isCurrentUser && (
            <p className="text-gray-600">
              Share your first photo or video by creating a post.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
