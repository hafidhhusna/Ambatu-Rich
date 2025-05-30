import { prisma } from '@/lib/db';
import { getUserSession } from '@/lib/session';

// Direct database functions instead of HTTP calls
export async function getFinancialOverview() {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      throw new Error('Unauthorized - No valid session');
    }

    const userId = session.id;
    console.log('📊 Getting financial overview for user:', userId);

    // Get current month & year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Fetch budget_plan for this month
    const budgets = await prisma.budget_plan.findMany({
      where: {
        user_id: userId,
        date_range: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Fetch struk_scanned for this month
    const struks = await prisma.struk_scanned.findMany({
      where: {
        user_id: userId,
        uploadedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const total_budget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const total_spent = struks.reduce((sum, s) => sum + (s.amount ?? 0), 0);

    const result = {
      month: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
      total_budget,
      total_spent,
      remaining_budget: total_budget - total_spent,
    };

    console.log('✅ Financial overview retrieved:', result);
    return result;
  } catch (error) {
    console.error('💥 Financial overview error:', error);
    throw error;
  }
}

export async function getExpenseBreakdown() {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      throw new Error('Unauthorized - No valid session');
    }

    const userId = session.id;
    console.log('📊 Getting expense breakdown for user:', userId);

    // Get current month & year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Fetch expenses for this month grouped by type
    const struks = await prisma.struk_scanned.findMany({
      where: {
        user_id: userId,
        uploadedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Group by type and calculate totals
    const breakdown = struks.reduce((acc: any, struk) => {
      const type = struk.type || 'Lainnya';
      const amount = struk.amount || 0;

      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += amount;
      return acc;
    }, {});

    const total = Object.values(breakdown).reduce(
      (sum: number, amount) => sum + (amount as number),
      0
    );

    const items = Object.entries(breakdown).map(([type, amount]) => ({
      type,
      amount: amount as number,
      percentage: total > 0 ? ((amount as number) / total) * 100 : 0,
    }));

    const result = { items };
    console.log('✅ Expense breakdown retrieved:', { itemCount: items.length });
    return result;
  } catch (error) {
    console.error('💥 Expense breakdown error:', error);
    throw error;
  }
}

export async function getImprovementAreas() {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      throw new Error('Unauthorized - No valid session');
    }

    console.log('📊 Getting improvement areas for user:', session.id);

    // Return some sample improvement tips
    const result = [
      {
        category: 'Makanan',
        tip: 'Pertimbangkan untuk memasak di rumah lebih sering',
      },
      {
        category: 'Transportasi',
        tip: 'Gunakan transportasi umum atau berbagi kendaraan',
      },
      {
        category: 'Hiburan',
        tip: 'Cari aktivitas gratis atau berbiaya rendah',
      },
      { category: 'Belanja', tip: 'Buat daftar belanja dan patuhi anggaran' },
    ];

    console.log('✅ Improvement areas retrieved:', { tipCount: result.length });
    return result;
  } catch (error) {
    console.error('💥 Improvement areas error:', error);
    throw error;
  }
}

// Keep the old function for backward compatibility but make it simpler
export async function fetchInternalAPI(path: string, cookie: string) {
  // This function is now deprecated - use direct functions above instead
  console.warn(
    '⚠️ fetchInternalAPI is deprecated, use direct database functions instead'
  );
  throw new Error(
    'fetchInternalAPI is deprecated - use direct database functions'
  );
}
