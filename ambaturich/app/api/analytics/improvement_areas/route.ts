import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import openai from "@/lib/openai";
import { getUserSession } from "@/lib/session";
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
    }
}