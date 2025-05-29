import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error('Email/username and password are required');
        }

        // Determine if input is email or username
        const isEmail = credentials.emailOrUsername.includes('@');

        // Find user by email or username
        const user = await prisma.user.findUnique({
          where: isEmail
            ? { email: credentials.emailOrUsername }
            : { username: credentials.emailOrUsername },
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email or username');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        // Include any updated profile data from token
        if (token.name) session.user.name = token.name;
        if (token.username) session.user.username = token.username;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.username = user.username;
      }

      // Handle session updates (when update() is called)
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.username = session.user.username;
        token.picture = session.user.image;
      }

      return token;
    },
    // Add this callback to handle the account linking
    async signIn({ user, account, profile, email, credentials }) {
      // Allow OAuth providers to link to existing accounts
      if (account && account.provider === 'google' && profile?.email) {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { account: true },
        });

        if (existingUser) {
          // Update or create the Google account for this user
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
              session_state: account.session_state,
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
              session_state: account.session_state,
            },
          });

          return true; // Allow sign-in
        }
      }

      return true; // Default: allow sign-in
    },
  },
  // Add this to debug any issues with NextAuth
  debug: false,
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
