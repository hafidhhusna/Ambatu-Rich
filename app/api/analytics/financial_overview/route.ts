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

    // Get current month & year
    const now = new Date();
    const currentMonth = now.getMonth(); // 0 = January
    const currentYear = now.getFullYear();

    // Get start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

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
      month: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`,
      total_budget,
      total_spent,
      remaining_budget: total_budget - total_spent,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/budget-summary]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
