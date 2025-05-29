export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;

    // Dapatkan rentang waktu bulan saat ini
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Ambil data struk bulan ini
    const struks = await prisma.struk_scanned.findMany({
      where: {
        user_id: userId,
        uploadedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        amount: {
          not: null,
        },
        type: {
          not: null,
        },
      },
    });

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
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    }));

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error("[GET /api/expense-breakdown]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
