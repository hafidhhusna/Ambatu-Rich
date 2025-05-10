import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';

export async function GET() {
  try {
    const userSession = await getUserSession();

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return only needed user information
    return NextResponse.json({
      id: userSession.id,
      name: userSession.name,
      email: userSession.email,
    });
  } catch (error) {
    console.error('Error fetching user session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
