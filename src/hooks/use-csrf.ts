import { useState, useCallback } from 'react';
import axios from '@/lib/axios';

interface UseCsrfReturn {
  getCsrfToken: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  csrfToken: string | null;
}

export function useCsrf(): UseCsrfReturn {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCsrfToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/sanctum/csrf-cookie');
      setCsrfToken(response.data.csrf_token);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch CSRF token');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getCsrfToken, isLoading, error, csrfToken };
}
