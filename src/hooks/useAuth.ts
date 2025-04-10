import { useState } from 'react';
import { login as loginService, register as registerService } from '@/services/authService';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useAuthContext();

  const login = async ({ email, password }: LoginParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService({ email, password });
      
      // Update auth context with user data
      await contextLogin(email, password);
      
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
  const { register: contextRegister } = useAuthContext();

  const register = async ({ name, email, password, password_confirmation }: RegisterParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerService({ name, email, password, password_confirmation });
      
      // Update auth context with user data
      await contextRegister(name, email, password);
      
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