'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  bio: z
    .string()
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    })
    .optional(),
});

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get form with validation
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      bio: '',
    },
  });

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/auth/signin',
      });
      toast.success('Logged out successfully');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      // In a real application, you would update the user profile here
      console.log('Profile update values:', values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update session if needed
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
        },
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || 'U';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="relative pb-3">
            <div className="absolute right-4 top-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                  >
                    <IconX className="h-5 w-5" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={form.handleSubmit(onSubmit)}
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
                >
                  <IconEdit className="h-5 w-5" />
                  <span className="sr-only">Edit profile</span>
                </Button>
              )}
            </div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              View and update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <Form {...form}>
                <form className="space-y-4">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 mb-6">
                    <div className="relative group">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={session?.user?.image || ''} />
                        <AvatarFallback className="text-2xl">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <IconCamera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            className="resize-none"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          You can @mention other users and organizations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className="text-2xl">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col sm:mt-2">
                    <h3 className="text-xl font-medium">
                      {session?.user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Separator className="my-2" />
              <div className="flex flex-col space-y-2">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <IconLogout className="h-4 w-4" />
                  Sign Out
                </Button>
                <p className="text-xs text-muted-foreground">
                  This will log you out of your current session
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
