import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import openai from "@/lib/openai";
import { getUserSession } from "@/lib/session";
<<<<<<< HEAD
import { error } from "console";


export async function GET(req : NextRequest){
    try{
        const session = await getUserSession();
        if(!session || !session.id){
            return NextResponse.json(
                {error : 'Unauthorized'},
                {status : 401}
            )
        };

        const userId = session.id;
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const struks =await prisma.struk_scanned.findMany({
            where : {
                user_id : userId,
                uploadedAt : {
                    gte : start,
                    lte : end
                },
                amount : {not : null},
                type : {not: null},
            },
        });

        if(struks.length ===0){
            return NextResponse.json({
                tip : "belum ada pengeluaran bulan ini",
            });
        }

        const pengeluaran : Record<string, number> = {};
        struks.forEach((s) => {
            const type = s.type!;
            const amount = s.amount!;
            pengeluaran[type] = (pengeluaran[type] || 0) + amount;
        });

        const summary = Object.entries(pengeluaran)
            .map(([type, amount]) => `${type} : Rp${amount.toLocaleString()}`)
            .join(", ");

        const prompt = `Saya memiliki data pengeluaran bulan ini : ${summary}. Berikan 1 kalimat saran keuangan yang masuk akal berdasarkan data ini.`;

        const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-prover-v2:free',
        messages: [
            { role: 'system', content: 'Kamu adalah asisten keuangan pribadi yang cerdas dan teliti.' },
            { role: 'user', content: prompt },
            ],
        });

        const tip = completion.choices[0].message.content?.trim();

        return NextResponse.json({tip});
    }catch(error){
        console.error("[GET /api/analytics/improvement_areas]", error);
        return NextResponse.json({error : "Gagal Menghasilkan Saran"}, {status : 500});
=======

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;
    const now = new Date();

    const getRange = (monthOffset: number) => {
      const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      return { start, end };
    };

    const { start: currentStart, end: currentEnd } = getRange(0);
    const { start: prevStart, end: prevEnd } = getRange(-1);

    const fetchData = async (start: Date, end: Date) => {
      const struks = await prisma.struk_scanned.findMany({
        where: {
          user_id: userId,
          uploadedAt: { gte: start, lte: end },
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
      fetchData(currentStart, currentEnd),
      fetchData(prevStart, prevEnd),
    ]);

    const categories = new Set([
      ...Object.keys(currentData),
      ...Object.keys(prevData),
    ]);

    const improvements = [];

    for (const category of categories) {
      const curr = currentData[category] || 0;
      const prev = prevData[category] || 0;

      const change =
        prev === 0
          ? curr > 0
            ? 100
            : 0
          : ((curr - prev) / prev) * 100;

      // Prompt to OpenAI for a tip
      const prompt = `Saya melihat pengeluaran kategori "${category}" sebesar Rp${curr.toLocaleString()} bulan ini. ${change > 0
        ? `Itu naik ${change.toFixed(1)}% dibanding bulan lalu.` 
        : change < 0
        ? `Itu turun ${Math.abs(change).toFixed(1)}% dari bulan lalu.` 
        : `Tidak ada perubahan dari bulan lalu.`} Berikan 1 kalimat saran masuk akal untuk kategori ini.`;

      const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-prover-v2:free',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten keuangan pribadi yang cerdas dan teliti.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const tip = completion.choices[0].message.content?.trim() || "";

      improvements.push({
        category,
        change:
          prev === 0 && curr === 0
            ? "No spending in this category"
            : change > 0
            ? `You spent ${change.toFixed(1)}% more than last month`
            : change < 0
            ? `You spent ${Math.abs(change).toFixed(1)}% less than last month`
            : "No change from last month",
        tip,
      });
>>>>>>> parent of 0fd2410 (Merge branch 'main' into 497916)
    }
}