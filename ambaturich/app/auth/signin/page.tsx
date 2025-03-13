'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FiMail } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { z } from 'zod';
import { toast } from 'sonner';
import { BottomGradient } from '@/components/ui/bottom-gradient';
import { LabelInputContainer } from '@/components/ui/label-input-container';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Define validation schema with Zod
  const signInSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  });

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

    // First try to authenticate using NextAuth credentials
    signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })
      .then((result) => {
        if (result?.error) {
          toast.error('Sign in failed', {
            description: 'Invalid email or password',
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
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <FiMail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
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
                  type="password"
                  className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
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
