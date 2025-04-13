
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, PlusSquare, User, LogOut } from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    try {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    } catch (error) {
      console.error("Error getting initials:", error);
      return "U";
    }
  };

  return (
    <div className="min-h-screen bg-sevima-gray">
      {/* Mobile top navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 border-b md:hidden">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue">
          Insta-App
        </h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-sevima-darkGray"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>
      
      {/* Desktop and Mobile layout */}
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-white">
          <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
            <div className="px-4">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue">
                Insta-App
              </h1>
            </div>
            <nav className="mt-8 flex flex-col flex-1 px-2 space-y-1">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-sevima-black hover:bg-sevima-gray rounded-md"
              >
                <Home className="h-5 w-5 mr-3 text-sevima-blue" />
                <span className="text-sevima-black text-md">Home</span>
              </Link>
              <Link
                to="/create"
                className="flex items-center px-4 py-3 text-sevima-black hover:bg-sevima-gray rounded-md"
              >
                <PlusSquare className="h-5 w-5 mr-3 text-sevima-blue" />
                <span className="text-sevima-black text-md">Create</span>
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center px-4 py-3 text-sevima-black hover:bg-sevima-gray rounded-md"
              >
                <User className="h-5 w-5 mr-3 text-sevima-blue" />
                <span className="text-sevima-black text-md">Profile</span>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center justify-start px-4 py-3 text-sevima-black hover:bg-sevima-gray rounded-md"
              >
                <LogOut className="h-5 w-5 mr-3 text-sevima-blue" />
                <span className="text-sevima-black text-md">Logout</span>
              </Button>
            </nav>
            <div className="px-4 mt-auto pb-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 bg-sevima-blue text-white">
                  {user?.profile_picture_url && <AvatarImage src={user?.profile_picture_url} alt={user?.username} />}
                  {!user?.profile_picture_url && <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>}
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white p-3 border-t">
          <Link to="/" className="flex flex-col items-center text-sevima-darkGray">
            <Home className="h-6 w-6 text-sevima-blue" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/create" className="flex flex-col items-center text-sevima-darkGray">
            <PlusSquare className="h-6 w-6 text-sevima-blue" />
            <span className="text-xs mt-1">Create</span>
          </Link>
          <Link to={`/profile/${user?.username}`} className="flex flex-col items-center text-sevima-darkGray">
            <Avatar className="h-6 w-6 bg-sevima-blue text-white">
              {user?.profile_picture_url && <AvatarImage src={user?.profile_picture_url} alt={user?.username} />}
              {!user?.profile_picture_url && <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>}
            </Avatar>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
