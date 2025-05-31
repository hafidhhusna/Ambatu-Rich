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

    console.log(`📊 [Expense Breakdown] Filtering for ${month}/${year}:`);
    console.log(`   Start: ${startOfMonth}`);
    console.log(`   Before: ${startOfNextMonth}`);

    // Ambil data struk untuk bulan yang dipilih
    const struks = await prisma.struk_scanned.findMany({
      where: {
        user_id: userId,
        uploadedAt: {
          gte: new Date(startOfMonth),
          lt: new Date(startOfNextMonth),
        },
        amount: {
          not: null,
        },
        type: {
          not: null,
        },
      },
    });

    console.log(`📈 [Expense Breakdown] Found ${struks.length} transactions`);

    // Hitung total pengeluaran
    const totalAmount = struks.reduce((sum, s) => sum + (s.amount ?? 0), 0);

    // Kelompokkan berdasarkan `type`
    const typeMap = new Map<string, number>();
    for (const s of struks) {
      const type = s.type!;
      const amount = s.amount!;
      typeMap.set(type, (typeMap.get(type) ?? 0) + amount);
    }

    // Ubah menjadi array dengan persentase
    const breakdown = Array.from(typeMap.entries()).map(([type, amount]) => ({
      type,
      amount,
      percentage:
        totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    }));

    console.log(
      `💹 [Expense Breakdown] Total amount: ${totalAmount}, categories: ${breakdown.length}`
    );

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error('[GET /api/analytics/expense_breakdown]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
