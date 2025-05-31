'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { z } from 'zod';
import { toast } from 'sonner';
import { BottomGradient } from '@/components/ui/bottom-gradient';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import {
  performCookieCleanup,
  startCookieMonitoring,
} from '@/lib/cookie-utils';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Emergency cookie clear on every page load
  useEffect(() => {
    const clearAllCookies = () => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Multiple clearing attempts
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
      }
    };

    clearAllCookies();
  }, []);

  // Define validation schema with Zod - accepts either email or username
  const signInSchema = z.object({
    emailOrUsername: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required'),
  });

  // Helper function to determine if input is email or username
  const isEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear cookies before every signin attempt
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    try {
      signInSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);

    signIn('credentials', {
      redirect: false,
      emailOrUsername: formData.emailOrUsername,
      password: formData.password,
    })
      .then((result) => {
        if (result?.error) {
          toast.error('Sign in failed', {
            description: 'Invalid email/username or password',
          });
        } else if (result?.ok) {
          toast.success('Signed in successfully!', {
            description: 'Welcome back to Ambatu-Rich',
          });
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 100);
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        toast.error('Login failed', {
          description: 'An unexpected error occurred',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);

    signIn('google', { callbackUrl: '/' }).catch((error) => {
      console.error('Google sign in failed:', error);
      toast.error('Google sign in failed', {
        description: 'An unexpected error occurred',
      });
      setIsLoading(false);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 bg-background border shadow-md dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-bold text-xl text-foreground dark:text-white">
          Welcome Back
        </h2>
        <p className="text-muted-foreground dark:text-gray-400 text-sm max-w-sm mt-2">
          Enter your credentials to access your account
        </p>

        <div className="my-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="emailOrUsername" className="dark:text-gray-300">
                Email or Username
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  {isEmail(formData.emailOrUsername) ? (
                    <FiMail className="h-4 w-4" />
                  ) : (
                    <FiUser className="h-4 w-4" />
                  )}
                </div>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.emailOrUsername && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emailOrUsername}
                </p>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password" className="dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <RiLockPasswordLine className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </LabelInputContainer>

            <div className="flex items-center justify-between mb-6">
              <div className="text-sm">
                <a
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                  onClick={() => router.push('/auth/forgot-password')}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-foreground dark:text-white rounded-md h-10 font-medium shadow-sm bg-secondary dark:bg-gray-800 hover:bg-secondary/80 dark:hover:bg-gray-700"
              type="button"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="text-sm">Sign in with Google</span>
              <BottomGradient />
            </button>

            <button
              className="bg-[#1A237E] text-white relative group/btn from-primary to-primary/80 block w-full text-primary-foreground rounded-md h-10 font-medium shadow-sm"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'} &rarr;
              <BottomGradient />
            </button>
          </form>

          <div className="bg-gradient-to-r from-transparent via-muted to-transparent my-6 h-[1px] w-full dark:via-gray-700" />

          <div className="text-center text-sm dark:text-gray-300">
            Don&apos;t have an account?{' '}
            <a
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              onClick={() => router.push('/auth/register')}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
