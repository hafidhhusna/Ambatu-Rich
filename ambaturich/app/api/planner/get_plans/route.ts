import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plans = await prisma.budget_plan.findMany({
    where: {
      user_id: session.user.id,
    },
    orderBy: {
      date_range: 'desc',
    },
  });

  return NextResponse.json(plans);
}
