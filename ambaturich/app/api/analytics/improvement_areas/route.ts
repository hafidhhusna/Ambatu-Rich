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
        console.log(userId)
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
        console.log('Data Struks: ', struks)

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

        // const summary = Object.entries(pengeluaran)
        //     .map(([type, amount]) => `${type} : Rp${amount.toLocaleString()}`)
        //     .join(", ");

        const tips: Record<string, string> = {};
        for (const [type, amount] of Object.entries(pengeluaran)){
            const prompt = `Saya memiliki pengeluaran bulan ini : ${amount.toLocaleString()} untuk kategori ${type}, sebagai seorang asisten keuangan yang handal, analisis dan langsung berikan 1 kalimat tidak lebih dari 150 karakter saran keuangan secara profesional dan ramah berdasarkan pengeluaran saya (tidak perlu menyampaikan hasil analisis anda, langsung berikan saran saja).`;
            const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-prover-v2:free',
            messages: [
                { role: 'system', content: 'Kamu adalah asisten keuangan pribadi yang cerdas dan teliti.' },
                { role: 'user', content: prompt },
                ],
            });
            const suggestion = completion.choices[0].message.content?.trim() || "";
            tips[type] = suggestion;
        }
        console.log("AI Tips : ", tips);

        return NextResponse.json({tips});
    }catch(error){
        console.error("[GET /api/analytics/improvement_areas]", error);
        return NextResponse.json({error : "Gagal Menghasilkan Saran"}, {status : 500});
    }
}