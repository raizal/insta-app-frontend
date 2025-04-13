import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCsrf } from "@/hooks/use-csrf";
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, isLoading, error } = useRegister();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { getCsrfToken, isLoading: csrfLoading, error: csrfError, csrfToken } = useCsrf();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      if (typeof error === 'object' && error !== null) {
        // Handle validation errors from API
        setFormErrors(error as Record<string, string[]>);
      } else {
        // Handle general errors
        toast.error(typeof error === 'string' ? error : 'Registration failed. Please try again.');
      }
    }
  }, [error]);

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    
    if (!username.trim()) errors.username = ["Username is required"];
    if (!email.trim()) errors.email = ["Email is required"];
    if (!name.trim()) errors.name = ["Display name is required"];
    if (!password) errors.password = ["Password is required"];
    if (password.length < 8) errors.password = ["Password must be at least 8 characters"];
    if (password !== passwordConfirmation) errors.passwordConfirmation = ["Passwords don't match"];
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        username,
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        image: imageFile,
        _token: csrfToken,
      });
    } catch (err) {
      // Error is handled by the useRegister hook via the error state
    }
  };

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sevima-gray px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue">
            Insta-App
          </h1>
          <p className="mt-2 text-sevima-darkGray">
            Join Insta-App and start sharing your moments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-sevima-blue">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            {csrfError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {typeof csrfError === 'string' ? csrfError : 'Failed to get CSRF token. Please refresh the page.'}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 flex justify-center">
                {imagePreview ? (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0 h-8 w-8 rounded-full p-1.5"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-full border-gray-300 h-48 w-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed rounded-full p-6 border-gray-300 h-48 w-48">
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
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={formErrors.username ? "border-red-500" : ""}
                />
                {formErrors.username && formErrors.username.map((error, index) => (
                  <p key={`username-error-${index}`} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && formErrors.email.map((error, index) => (
                  <p key={`email-error-${index}`} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Displayed Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Displayed Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && formErrors.name.map((error, index) => (
                  <p key={`name-error-${index}`} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && formErrors.password.map((error, index) => (
                  <p key={`password-error-${index}`} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
              <div className="space-y-2">
                <label htmlFor="passwordConfirmation" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className={formErrors.passwordConfirmation ? "border-red-500" : ""}
                />
                {formErrors.passwordConfirmation && formErrors.passwordConfirmation.map((error, index) => (
                  <p key={`passwordConfirmation-error-${index}`} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-sevima-darkGray">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-sevima-blue hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
