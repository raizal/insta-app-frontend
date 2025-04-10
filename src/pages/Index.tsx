
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Feed from "./Feed";

const Index = () => {
  // Add page title for Index/Home page
  useEffect(() => {
    document.title = "Home | Insta-Echo";
    return () => {
      document.title = "Insta-Echo";
    };
  }, []);
  
  return <Feed />;
};

export default Index;
