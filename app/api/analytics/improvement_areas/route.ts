import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import openai from '@/lib/openai';
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

    const getDateRange = (targetYear: number, targetMonth: number) => {
      // Create ISO date strings for precise filtering
      const startOfMonth = `${targetYear}-${targetMonth
        .toString()
        .padStart(2, '0')}-01T00:00:00.000Z`;
      const nextMonth = targetMonth === 12 ? 1 : targetMonth + 1;
      const nextYear = targetMonth === 12 ? targetYear + 1 : targetYear;
      const startOfNextMonth = `${nextYear}-${nextMonth
        .toString()
        .padStart(2, '0')}-01T00:00:00.000Z`;

      return {
        start: new Date(startOfMonth),
        end: new Date(startOfNextMonth),
      };
    };

    // Get current selected month and previous month
    const currentRange = getDateRange(year, month);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevRange = getDateRange(prevYear, prevMonth);

    console.log(
      `🔄 [Improvement Areas] Current: ${month}/${year}, Previous: ${prevMonth}/${prevYear}`
    );

    const fetchData = async (start: Date, end: Date) => {
      const struks = await prisma.struk_scanned.findMany({
        where: {
          user_id: userId,
          uploadedAt: {
            gte: start,
            lt: end,
          },
          amount: { not: null },
          type: { not: null },
        },
      });

      const grouped: Record<string, number> = {};
      struks.forEach((s) => {
        grouped[s.type!] = (grouped[s.type!] || 0) + s.amount!;
      });

      return grouped;
    };

    const [currentData, prevData] = await Promise.all([
      fetchData(currentRange.start, currentRange.end),
      fetchData(prevRange.start, prevRange.end),
    ]);

    console.log(`📊 [Improvement Areas] Current data:`, currentData);
    console.log(`📊 [Improvement Areas] Previous data:`, prevData);

    const categories = new Set([
      ...Object.keys(currentData),
      ...Object.keys(prevData),
    ]);

    const improvements = [];

    // Get month names for the prompt
    const currentMonthName = new Date(year, month - 1).toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
    const prevMonthName = new Date(prevYear, prevMonth - 1).toLocaleString(
      'id-ID',
      { month: 'long', year: 'numeric' }
    );

    for (const category of Array.from(categories)) {
      const curr = currentData[category] || 0;
      const prev = prevData[category] || 0;

      const change =
        prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

      // Prompt to OpenAI for a tip
      const prompt = `Saya melihat pengeluaran kategori "${category}" sebesar Rp${curr.toLocaleString()} pada ${currentMonthName}. ${
        change > 0
          ? `Itu naik ${change.toFixed(1)}% dibanding ${prevMonthName}.`
          : change < 0
          ? `Itu turun ${Math.abs(change).toFixed(1)}% dari ${prevMonthName}.`
          : `Tidak ada perubahan dari ${prevMonthName}.`
      } Berikan 1 kalimat saran masuk akal untuk kategori ini.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Kamu adalah asisten keuangan pribadi yang cerdas dan teliti.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const tip = completion.choices[0].message.content?.trim() || '';

      improvements.push({
        category,
        change:
          prev === 0 && curr === 0
            ? 'No spending in this category'
            : change > 0
            ? `You spent ${change.toFixed(1)}% more than last month`
            : change < 0
            ? `You spent ${Math.abs(change).toFixed(1)}% less than last month`
            : 'No change from last month',
        tip,
      });
    }

    console.log(
      `💡 [Improvement Areas] Generated ${improvements.length} improvements`
    );

    return NextResponse.json(improvements);
  } catch (error) {
    console.error('[GET /api/analytics/improvement_areas]', error);
    return NextResponse.json(
      { error: 'Gagal Menghasilkan Saran' },
      { status: 500 }
    );
  }
}
