import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useSubmitPost } from "@/hooks/useSubmitPost";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { isSubmitting, submitPostWithImage } = useSubmitPost();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    // Submit the post using our hook
    const response = await submitPostWithImage(content, imageFile);
    
    if (response) {
      // Reset form state
      setContent("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Navigate to home page
      navigate("/");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
            required
          />

          {imagePreview ? (
            <div className="relative">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 rounded-full p-1.5"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-md max-h-[300px] object-contain w-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 border-gray-300">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <ImagePlus className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload an image</span>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue hover:opacity-90"
            disabled={!(content.trim() && imageFile) || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
