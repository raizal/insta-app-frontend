import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCsrf } from "@/hooks/use-csrf";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { getCsrfToken, isLoading: csrfLoading, error: csrfError, csrfToken } = useCsrf();

  // useEffect(() => {
  //   getCsrfToken();
  // }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting");
    if (!email || !password) return;
    const result = await login({ email, password, _token: csrfToken });
    console.log("Result: " + result);
    if (result.success) {
      // navigate("/");
    }
  }, [email, password, csrfToken, login]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sevima-gray px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue">
            Insta-App
          </h1>
          <p className="mt-2 text-sevima-darkGray">
            Connect with friends and share your moments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-sevima-blue">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}  className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email or Username
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sevima-darkBlue via-sevima-blue to-sevima-lightBlue hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-sevima-darkGray">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-sevima-blue hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
