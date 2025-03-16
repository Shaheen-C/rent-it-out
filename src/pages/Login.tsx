import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../libs/createClient';
import { AuthError, Session } from '@supabase/supabase-js';

type LoginType = 'user' | 'admin' | null;

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<LoginType>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User is already logged in');
        console.log('Session:', session);
        // Check if user is admin (you'll need to implement this logic based on your database)
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          console.log('User:', user);
        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const validateForm = () => {
    setErrorMessage(null);
    
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return false;
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      if (loginType === 'admin') {
        navigate('/admin/dashboard');
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      if (data.session) {
        navigate('/');
        // Check user role for admin access
        // if (loginType === 'admin') {
        //   navigate('/admin/dashboard');
        //   const { data: user } = await supabase
        //     .from('users')
        //     .select('role')
        //     .eq('id', data.session.user.id)
        //     .single();
          
        //   if (user?.role !== 'admin') {
        //     await supabase.auth.signOut();
        //     setErrorMessage('You do not have admin access');
        //     setIsLoading(false);
        //     return;
        //   }
          
        //   navigate('/admin/dashboard');
        // } else {
        //   navigate('/');
        // }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      // After signup, insert user role into users table
      // if (data.user) {
      //   const { error: insertError } = await supabase
      //     .from('users')
      //     .insert([
      //       { 
      //         id: data.user.id, 
      //         email: data.user.email,
      //         role: loginType === 'admin' ? 'admin' : 'user',
      //       }
      //     ]);
          
      //   if (insertError) throw insertError;
      // }
      
      setSuccessMessage('Registration successful! Please check your email for verification.');
      setFormData({ email: '', password: '', confirmPassword: '' });
      setIsSignUp(false);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccessMessage('Password reset link has been sent to your email');
      setShowForgotPassword(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An error occurred during password reset');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showForgotPassword) {
      handleResetPassword();
    } else if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#805532] bg-opacity-10">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-[#805532] hover:text-[#805532]/80 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {!loginType ? (
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#805532] mb-6 text-center">Choose Login Type</h2>
          <div className="space-y-4">
            <button
              onClick={() => setLoginType('user')}
              className="w-full bg-[#805532] text-white py-3 rounded-md hover:bg-[#805532]/80 transition"
            >
              User Login
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className="w-full border-2 border-[#805532] text-[#805532] py-3 rounded-md hover:bg-[#805532]/10 transition"
            >
              Admin Login
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
          <button 
            onClick={() => {
              setLoginType(null);
              setErrorMessage(null);
              setSuccessMessage(null);
              setIsSignUp(false);
              setShowForgotPassword(false);
            }}
            className="mb-4 text-[#805532] hover:text-[#805532]/80 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to selection
          </button>

          <h2 className="text-2xl font-bold text-[#805532] mb-6 text-center">
            {loginType === 'admin' ? 'Admin Login' : (isSignUp ? 'Create Account' : 'Welcome Back')}
          </h2>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[#805532] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#805532]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805532]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#805532] text-white py-2 rounded-md hover:bg-[#805532]/80 transition flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrorMessage(null);
                }}
                className="w-full text-[#805532] hover:text-[#805532]/80"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[#805532] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#805532]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805532]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[#805532] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-[#805532]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805532]"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-[#805532] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-[#805532]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805532]"
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setErrorMessage(null);
                  }}
                  className="text-[#805532] hover:text-[#805532]/80 text-sm"
                >
                  Forgot Password?
                </button>
              )}

              <button
                type="submit"
                className="w-full bg-[#805532] text-white py-2 rounded-md hover:bg-[#805532]/80 transition flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>

              {loginType === 'user' && (
                <p className="text-center text-[#805532]">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#805532] hover:text-[#805532]/80 font-semibold"
                  >
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;