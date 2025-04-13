import { useState } from 'react';
import { login as loginService, register as registerService, me as meService } from '@/services/authService';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { WithCsrfToken } from '@/types/common';

interface LoginParams extends WithCsrfToken {
  email: string;
  password: string;
}

interface RegisterParams extends WithCsrfToken {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  image?: File;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useAuthContext();

  const login = async ({ email, password, _token }: LoginParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService({ email, password, _token });
      
      // Update auth context with user data
      await contextLogin(response);
      
      toast.success('Login successful!');
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useAuthContext();

  const register = async ({ name, username, email, password, password_confirmation, image, _token }: RegisterParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerService({ name, username, email, password, password_confirmation, image, _token });

      await contextLogin(response);

      toast.success('Registration successful!');
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}; 

export const useMe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useAuthContext();

  const me = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await meService();
      await contextLogin(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user data.');
    } finally {
      setIsLoading(false);
    }
  };

  return { me, isLoading, error };
};