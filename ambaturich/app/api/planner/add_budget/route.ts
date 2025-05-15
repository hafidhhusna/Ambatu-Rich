import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getUserSession();
    console.log("Session : ", session);
    console.log("User ID : ", session.id);

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Ensure user exists before creating the plan
    await prisma.user.upsert({
      where: { id: session.id },
      update: {},
      create: {
        id: session.id,
        name: session.name ?? "Unknown",
        email: session.email ?? "",
        image: session.image ?? null,
      },
    });

    const body = await req.json();
    const { budget, date_range, ai_note } = body;

    if (typeof budget !== "number" || !date_range) {
      return NextResponse.json(
        { error: "Budget and Date Range are Required" },
        { status: 400 }
      );
    }

    const newPlan = await prisma.budget_plan.create({
      data: {
        budget,
        date_range: new Date(date_range),
        ai_note: ai_note ?? null,
        user_id: session.id,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("[POST budget_plan]", error);
    return NextResponse.json(
      { error: "failed to create budget plan" },
      { status: 500 }
    );
  }
}
