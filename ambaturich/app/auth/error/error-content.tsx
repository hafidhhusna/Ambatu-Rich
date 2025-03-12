'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || '';

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      toast.error('Account linking failed', {
        description:
          'This email is already associated with another account. Please sign in using your original method.',
      });
    } else if (error) {
      toast.error('Authentication error', {
        description: getErrorDescription(error),
      });
    }
  }, [error]);

  const getErrorDescription = (errorCode: string) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in using your original method.';
      case 'OAuthSignInError':
        return 'Could not sign in with the OAuth provider.';
      case 'OAuthCallbackError':
        return 'There was a problem with the OAuth callback.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="my-6 text-muted-foreground dark:text-gray-400">
      <p>{getErrorDescription(error)}</p>
    </div>
  );
}
