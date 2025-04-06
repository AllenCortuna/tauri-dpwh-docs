import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { successToast, errorToast } from './toast';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // For demonstration, using a hardcoded password
      if (credentials.username === 'admin' && credentials.password === 'AllenCortuna') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', credentials.username);
        
        setIsAuthenticated(true);
        successToast("Login successful!");
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 1000);
        
        return true;
      } else {
        errorToast("Invalid username or password!");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      errorToast("An error occurred during login.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    successToast("Logged out successfully");
    router.push('/login');
  };

  // Get current user
  const getUser = (): string | null => {
    return localStorage.getItem('user');
  };

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
    getUser
  };
};