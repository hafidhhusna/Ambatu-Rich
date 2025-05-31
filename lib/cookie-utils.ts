// Cookie utility functions for managing authentication cookies

export function performCookieCleanup(): void {
  if (typeof window === 'undefined') return;

  try {
    // Only clear specific problematic cookies, not all auth-related ones
    const cookiesToClear = [
      'duplicate-session-token',
      'stale-auth-token',
      // Add specific cookie names that are causing issues
    ];

    cookiesToClear.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });

    console.log('Targeted cookie cleanup completed');
  } catch (error) {
    console.error('Error during cookie cleanup:', error);
  }
}

export function startCookieMonitoring(): (() => void) | void {
  if (typeof window === 'undefined') return;

  try {
    // Monitor cookie size in development
    if (process.env.NODE_ENV === 'development') {
      const checkCookieSize = () => {
        const cookieSize = document.cookie.length;
        if (cookieSize > 8192) {
          // 8KB
          console.warn(
            `Large cookie detected: ${cookieSize} bytes. Consider cleaning up cookies.`
          );
        }
      };

      // Check every 30 seconds
      const interval = setInterval(checkCookieSize, 30000);

      // Initial check
      checkCookieSize();

      // Return cleanup function
      return () => clearInterval(interval);
    }
  } catch (error) {
    console.error('Error starting cookie monitoring:', error);
  }
}

export function getCookieSize(): number {
  if (typeof window === 'undefined') return 0;
  return document.cookie.length;
}

export function listAllCookies(): string[] {
  if (typeof window === 'undefined') return [];
  return document.cookie.split(';').map((c) => c.trim());
}
