import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string | null;
  }
}
