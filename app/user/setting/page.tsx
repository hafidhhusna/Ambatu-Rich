'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconLogout,
  IconUser,
  IconMail,
  IconCamera,
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconSettings,
  IconPalette,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters.',
    })
    .max(20, {
      message: 'Username must be less than 20 characters.',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get form with validation
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || '',
      username: session?.user?.username || '',
      email: session?.user?.email || '',
    },
  });

  // Fetch profile image separately
  React.useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch('/api/user/profile-image');
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.image || '');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (session?.user) {
      fetchProfileImage();
    }
  }, [session?.user]);

  // Update form when session changes
  React.useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || '',
        username: session.user.username || '',
        email: session.user.email || '',
      });
    }
  }, [
    session?.user?.name,
    session?.user?.username,
    session?.user?.email,
    form,
  ]);

  const handleLogout = async () => {
    try {
      toast.success('Logging out...');

      await new Promise((resolve) => setTimeout(resolve, 800));

      await signOut({
        callbackUrl: '/auth/signin',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file');
          return;
        }

        try {
          // Upload file to server
          const formData = new FormData();
          formData.append('file', file);

          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Failed to upload image');
          }

          const uploadResult = await uploadResponse.json();
          setProfileImage(uploadResult.imageUrl);
          toast.success(
            'Profile photo uploaded successfully. Click save to apply changes.'
          );
        } catch (error: any) {
          console.error('Error uploading image:', error);
          toast.error(error.message || 'Failed to upload image');
        }
      }
    };
    input.click();
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      console.log('Submitting profile update:', {
        name: values.name,
        username: values.username,
        hasImage: !!profileImage,
        imageLength: profileImage?.length || 0,
      });

      // Call API to update profile
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          image: profileImage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile update response:', result);

      // Update local states immediately for UI feedback
      setProfileImage(result.user.image || '');

      // Update session with the correct format for JWT strategy (excluding image)
      const sessionUpdateResult = await update({
        user: {
          name: result.user.name,
          username: result.user.username,
          // image: result.user.image, // Excluded to prevent headers too big error
        },
      });

      console.log('Session update result:', sessionUpdateResult);

      // Update the form with the new data
      form.reset({
        name: result.user.name,
        username: result.user.username,
        email: session?.user?.email || '',
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  }

  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || 'U';

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
          Account
        </div>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
          <CardHeader className="relative pb-3 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="absolute right-4 top-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    <IconX className="h-5 w-5" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={form.handleSubmit(onSubmit)}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    <IconDeviceFloppy className="h-5 w-5" />
                    <span className="sr-only">Save</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  <IconEdit className="h-5 w-5" />
                  <span className="sr-only">Edit profile</span>
                </Button>
              )}
            </div>
            <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <IconUser
                  className="text-blue-600 dark:text-blue-400"
                  size={16}
                />
              </div>
              Profile Information
            </CardTitle>
            <CardDescription>
              View and update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-gray-900">
            {isEditing ? (
              <Form {...form}>
                <form className="space-y-6">
                  <div className="flex justify-center sm:justify-start mb-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-blue-100 dark:border-blue-900">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback className="text-3xl bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={handlePhotoUpload}
                          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <IconCamera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                                className="focus-visible:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your username"
                                {...field}
                                className="focus-visible:ring-blue-500"
                              />
                            </FormControl>
                            <FormDescription>
                              Your unique username for the platform.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormDescription>
                            Your email address cannot be changed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <Avatar className="h-24 w-24 border-2 border-blue-100 dark:border-blue-900">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="text-3xl bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-center sm:text-left">
                    <h3 className="text-2xl font-medium text-blue-800 dark:text-blue-300">
                      {session?.user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      @{session?.user?.username || 'username'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Appearance Settings */}
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden h-fit">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <IconPalette
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose between light and dark mode
                  </p>
                </div>
                <ThemeToggle mode="select" />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden h-fit">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <IconAlertCircle
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  This will log you out of your current session
                </p>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <IconLogout className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
