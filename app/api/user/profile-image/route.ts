import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch only the user's image from the database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { image: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ image: user.image });
  } catch (error) {
    console.error('Error fetching user image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
