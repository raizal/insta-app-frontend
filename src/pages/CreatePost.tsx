
import { useEffect } from "react";
import PostForm from "@/components/PostForm";

const CreatePost = () => {
  // Set page title when component mounts
  useEffect(() => {
    document.title = "Create Post | Insta-Echo";
    return () => {
      document.title = "Insta-Echo";
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-sevima-blue">Create Post</h1>
      <PostForm />
    </div>
  );
};

export default CreatePost;
