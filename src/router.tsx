import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useMemo, useRef } from "react";
import Layout from "./components/Layout";
import { useMe } from "./hooks/useAuth";

export const Router = () => {
  const once = useRef<boolean>(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { me, isLoading: isMeLoading } = useMe();

  useEffect(() => {
    if (!once.current) {
      me();
      once.current = true;
    }
  }, [me]);

  const router = useMemo(() => createBrowserRouter(
      [
        {
          path: "/",
          element: isAuthenticated ? <Layout /> : <Navigate to="/login" />,
          children: [
            { index: true, element: <Feed /> },
            { path: "profile/:username", element: <Profile /> },
            { path: "create", element: <CreatePost /> },
          ]
        },
        { path: "/login", element: !isAuthenticated ? <Login /> : <Navigate to="/" />, },
        { path: "/register", element: !isAuthenticated ? <Register /> : <Navigate to="/" />, },
        { path: "*", element: <NotFound /> },
      ]
    ), [isAuthenticated]);

  return (isLoading || isMeLoading) ? <div>Loading...</div> : <RouterProvider router={router} />;
};