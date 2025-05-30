import { User, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  return session;
};

export const getUserSession = async (): Promise<
  (User & { id: string }) | null
> => {
  const authUserSession = await getServerSession(authOptions);
  if (!authUserSession?.user?.id) {
    return null;
  }

  return {
    ...authUserSession.user,
    id: authUserSession.user.id,
  };
};
