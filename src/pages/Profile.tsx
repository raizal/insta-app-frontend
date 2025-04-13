import { useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

const Profile = () => {
  const { username = "" } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { 
    posts, 
    user, 
    loading, 
    hasMore, 
    loadMore, 
    refreshProfile,
    followLoading,
    toggleFollowStatus
  } = useUserProfile(username);

  const isOwnProfile = currentUser?.username === username;

  const navigate = useNavigate();

  // Redirect to the user's own profile if no username is provided
  useEffect(() => {
    if (!username && currentUser?.username) {
      navigate(`/profile/${currentUser.username}`);
    }
  }, [username, currentUser]);

  // Infinite scroll setup
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20">
      <div className="bg-white rounded-md shadow border mb-6">
        <div className="p-6 flex flex-col items-center">
          <Avatar className="h-24 w-24">
            {user?.profile_picture_url && <AvatarImage src={user.profile_picture_url} alt={user.username} />}
            {!user?.profile_picture_url && <AvatarFallback className="text-2xl">{username?.[0].toUpperCase()}</AvatarFallback>}
          </Avatar>
          <h1 className="text-2xl font-bold mt-4">{user?.name || username}</h1>
          <p className="text-gray-600">@{user?.username || username}</p>
          
          <div className="flex space-x-4 mt-4">
            <div className="text-center">
              <span className="font-bold">{user?.posts_count || 0}</span>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user?.followers_count || 0}</span>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <span className="font-bold">{user?.following_count || 0}</span>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
          
          {/* Follow/Unfollow button */}
          {currentUser && !isOwnProfile && user && (
            <Button 
              onClick={toggleFollowStatus}
              variant={user.follow_status.is_following ? "outline" : "default"}
              size="sm"
              className="mt-4 flex items-center gap-1"
              disabled={followLoading}
            >
              {user.follow_status.is_following ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  {followLoading ? 'Updating...' : 'Following'}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  {followLoading ? 'Updating...' : 'Follow'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {posts.length > 0 ? (
        <>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <Post post={post} onPostUpdated={refreshProfile} />
                </div>
              );
            } else {
              return <Post key={post.id} post={post} onPostUpdated={refreshProfile} />;
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
          {user && user.username === username && (
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
