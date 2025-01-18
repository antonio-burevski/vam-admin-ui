/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

export const useAuthService = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']); // Access token from cookies
  const navigate = useNavigate();

  // Check if the user is already logged in
  const isAuthenticated = !!cookies.token;

  // Register method
  const register = async (username: string, email: string, password: string) => {
    try {
      // Call the register endpoint
      const response = await axiosInstance.post('/register', {
        username,
        email,
        password,
      });

      // Set the token in cookies upon successful registration
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // Set cookie expiration date to 7 days from now

      setCookie('token', response.data.token, {
        path: '/',
        expires,
        secure: true,
        sameSite: 'strict',
      });

      // Redirect to the homepage or dashboard
      navigate('/');
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  // Login method
  const login = async (username: string, password: string) => {
    try {
      // Call the login endpoint
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });

      // Set the token in cookies upon successful login
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // Set cookie expiration date to 7 days from now

      setCookie('token', response.data.token, {
        path: '/',
        expires,
        secure: true,
        sameSite: 'strict',
      });

      // Redirect to the homepage or dashboard
      navigate('/');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  // Logout method
  const logout = () => {
    // Remove the token from cookies on logout
    removeCookie('token', { path: '/' });
    navigate('/login'); // Redirect to login page after logout
  };

  // Expose the `isAuthenticated` flag and methods
  return {
    register,
    login,
    logout,
    isAuthenticated,
  };
};
