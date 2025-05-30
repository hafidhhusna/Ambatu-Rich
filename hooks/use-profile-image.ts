'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useProfileImage() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileImage = async () => {
    if (!session?.user?.id) {
      setProfileImage('/avatars/default.jpg');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile-image');

      if (!response.ok) {
        throw new Error('Failed to fetch profile image');
      }

      const data = await response.json();
      setProfileImage(data.image || '/avatars/default.jpg');
    } catch (err) {
      console.error('Error fetching profile image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProfileImage('/avatars/default.jpg');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, [session?.user?.id]);

  const refetchImage = () => {
    fetchProfileImage();
  };

  return {
    profileImage,
    isLoading,
    error,
    refetchImage,
  };
}
