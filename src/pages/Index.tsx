
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Feed from "./Feed";

const Index = () => {
  // Add page title for Index/Home page
  useEffect(() => {
    document.title = "Home | Insta-App";
    return () => {
      document.title = "Insta-App";
    };
  }, []);
  
  return <Feed />;
};

export default Index;
