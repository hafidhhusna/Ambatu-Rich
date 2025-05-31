import { prisma } from '@/lib/db';
import { getUserSession } from '@/lib/session';
import { error } from 'console';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    console.log('Session : ', session);

    if (!session || !session.id) {
      console.log('❌ No session found - unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('User ID : ', session.id);

    // Get query parameters for year and month
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    // Build where clause based on parameters
    let whereClause: any = {
      user_id: session.id,
    };

    // Add date filtering if year and month are provided
    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam);

      // Create ISO date strings for precise filtering
      const startOfMonth = `${year}-${month
        .toString()
        .padStart(2, '0')}-01T00:00:00.000Z`;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const startOfNextMonth = `${nextYear}-${nextMonth
        .toString()
        .padStart(2, '0')}-01T00:00:00.000Z`;

      console.log(`📅 Filtering for ${month}/${year}:`);
      console.log(`   Start: ${startOfMonth}`);
      console.log(`   Before: ${startOfNextMonth}`);

      whereClause.uploadedAt = {
        gte: new Date(startOfMonth),
        lt: new Date(startOfNextMonth),
      };
    }

    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    const struk_scanned = await prisma.struk_scanned.findMany({
      where: whereClause,
      select: {
        id: true,
        uploadedAt: true,
        type: true,
        amount: true,
        name: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    console.log(
      `📊 Found ${struk_scanned.length} records for month ${monthParam}/${yearParam}`
    );

    return NextResponse.json(struk_scanned);
  } catch (error) {
    console.error('Error Fetching Data :  ', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
