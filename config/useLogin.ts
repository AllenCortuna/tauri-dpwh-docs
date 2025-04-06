import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { successToast, errorToast } from './toast';
import { useAuthStore } from './authStore';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, login: storeLogin, logout: storeLogout, user } = useAuthStore();
  const router = useRouter();

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // For demonstration, using a hardcoded password
      if (credentials.username === 'admin' && credentials.password === 'AllenCortuna') {
        // Update Zustand store
        storeLogin(credentials.username);
        
        successToast("Login successful!");
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/dashboard');
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
    storeLogout();
    successToast("Logged out successfully");
    router.push('/login');
  };

  // Get current user
  const getUser = (): string | null => {
    return user;
  };

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
    getUser
  };
};