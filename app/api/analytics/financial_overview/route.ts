import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;

    // Get query parameters for year and month
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    // Use provided year/month or default to current month
    const now = new Date();
    const year = yearParam ? parseInt(yearParam) : now.getFullYear();
    const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1; // Keep month as 1-12

    // Create ISO date strings for precise filtering
    const startOfMonth = `${year}-${month
      .toString()
      .padStart(2, '0')}-01T00:00:00.000Z`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const startOfNextMonth = `${nextYear}-${nextMonth
      .toString()
      .padStart(2, '0')}-01T00:00:00.000Z`;

    console.log(`📅 [Financial Overview] Filtering for ${month}/${year}:`);
    console.log(`   Start: ${startOfMonth}`);
    console.log(`   Before: ${startOfNextMonth}`);

    const dateFilter = {
      gte: new Date(startOfMonth),
      lt: new Date(startOfNextMonth),
    };

    // Fetch budget_plan for this month
    const budgets = await prisma.budget_plan.findMany({
      where: {
        user_id: userId,
        date_range: dateFilter,
      },
    });

    // Fetch struk_scanned for this month
    const struks = await prisma.struk_scanned.findMany({
      where: {
        user_id: userId,
        uploadedAt: dateFilter,
      },
    });

    const total_budget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const total_spent = struks.reduce((sum, s) => sum + (s.amount ?? 0), 0);

    console.log(
      `💰 [Financial Overview] Found ${struks.length} transactions, total: ${total_spent}`
    );

    const result = {
      month: `${year}-${month.toString().padStart(2, '0')}`,
      total_budget,
      total_spent,
      remaining_budget: total_budget - total_spent,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/analytics/financial_overview]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
