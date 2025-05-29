'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { BottomGradient } from '@/components/ui/bottom-gradient';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Define validation schema with Zod
  const registerSchema = z
    .object({
      name: z.string().min(1, 'Name is required'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Please enter a valid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(formData);
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

    setLoading(true);

    try {
      const response = await fetch(
        `${window.location.origin}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Registration successful!', {
          description: 'Your account has been created.',
        });
        router.push('/auth/signin');
      } else {
        const errorData = await response.json();
        toast.error('Registration failed', {
          description: errorData.message || 'Something went wrong',
        });
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Please try again later',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 bg-background border shadow-md dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-bold text-xl text-foreground dark:text-white">
          Create Your Account
        </h2>
        <p className="text-muted-foreground dark:text-gray-400 text-sm max-w-sm mt-2">
          Join our community and start exploring
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name" className="dark:text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="username" className="dark:text-gray-300">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="johndoe"
              type="text"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="john@example.com"
              type="email"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                value={formData.password}
                onChange={handleChange}
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

          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmPassword" className="dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
                className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </LabelInputContainer>

          <button
            className="bg-[#1A237E] text-white relative group/btn block w-full rounded-md h-10 font-medium shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Account'} &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-muted to-transparent my-8 h-[1px] w-full dark:via-gray-700" />

          <div className="text-center text-sm mt-6 dark:text-gray-300">
            Already have an account?{' '}
            <a
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              onClick={() => router.push('/auth/signin')}
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
