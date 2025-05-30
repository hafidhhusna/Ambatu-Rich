import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Disable adapter to use pure JWT sessions
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        emailOrUsername: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Credentials auth attempt:', {
          emailOrUsername: credentials?.emailOrUsername,
        });

        if (!credentials?.emailOrUsername || !credentials?.password) {
          console.error('❌ Missing credentials');
          throw new Error('Email/username and password are required');
        }

        try {
          // Determine if input is email or username
          const isEmail = credentials.emailOrUsername.includes('@');
          console.log('📧 Is email?', isEmail);

          // Find user by email or username
          const user = await prisma.user.findUnique({
            where: isEmail
              ? { email: credentials.emailOrUsername }
              : { username: credentials.emailOrUsername },
          });

          console.log('👤 User found:', user ? 'Yes' : 'No');

          if (!user || !user.password) {
            console.error('❌ No user found or no password set');
            throw new Error('No user found with this email or username');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔑 Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.error('❌ Invalid password');
            throw new Error('Invalid password');
          }

          console.log('✅ Authentication successful for user:', user.email);

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            // Exclude image to prevent large session cookies
            // image: user.image,
          };
        } catch (error) {
          console.error('💥 Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      console.log('🎫 Session callback:', {
        session: !!session,
        token: !!token,
      });
      if (token && session.user) {
        session.user.id = token.sub!;
        // Include any updated profile data from token
        if (token.name) session.user.name = token.name;
        if (token.username) session.user.username = token.username;
        // Exclude image from session to prevent headers too big error
        // The image will be fetched separately when needed
        // if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      console.log('🔄 JWT callback:', {
        user: !!user,
        trigger,
        provider: account?.provider,
      });

      if (user) {
        token.sub = user.id; // Ensure sub is set to user.id
        token.id = user.id as string;
        token.username = user.username;
        // Only store essential data in JWT
        token.name = user.name;
        token.email = user.email;
      }

      // Handle OAuth sign-in (Google, etc.)
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Get user data from database for OAuth
          const dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
            select: { id: true, name: true, username: true, email: true },
          });

          if (dbUser) {
            token.sub = dbUser.id;
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.username = dbUser.username;
            token.email = dbUser.email;
          }
        } catch (error) {
          console.error('Error fetching OAuth user:', error);
        }
      }

      // Handle session updates (when update() is called)
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.username = session.user.username;
        // Exclude image from token to prevent headers too big error
        // token.picture = session.user.image;
      }

      return token;
    },
    // Add this callback to handle the account linking
    async signIn({ user, account, profile, email, credentials }) {
      console.log('🚪 SignIn callback:', {
        provider: account?.provider,
        email: profile?.email || email,
      });

      // For credentials provider, allow sign-in
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth providers, we'll handle them differently since we disabled the adapter
      if (account && account.provider === 'google' && profile?.email) {
        try {
          // Check if user exists with this email for OAuth
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          console.log(
            '👤 Existing Google user found:',
            existingUser ? 'Yes' : 'No'
          );

          // For now, allow Google sign-in if user exists
          // We'll handle account linking separately if needed
          return !!existingUser;
        } catch (error) {
          console.error('💥 Google OAuth error:', error);
          return false;
        }
      }

      return true; // Default: allow sign-in
    },
  },
  // Enable debug mode
  debug: true,
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
