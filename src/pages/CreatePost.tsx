
import { useEffect } from "react";
import PostForm from "@/components/PostForm";

const CreatePost = () => {
  // Set page title when component mounts
  useEffect(() => {
    document.title = "Create Post | Insta-App";
    return () => {
      document.title = "Insta-App";
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <PostForm />
    </div>
  );
};

export default CreatePost;
