import {fetchInternalAPI} from "@/lib/analytics_ai_assistant";
import openai from "@/lib/openai";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest){
    try{
        const cookie = req.headers.get("cookie") || "";
        const {message} = await req.json();

        const [overview, breakdown, tip] = await Promise.all([
            fetchInternalAPI("/api/analytics/financial_overview", cookie),
            fetchInternalAPI("/api/analytics/expense_breakdown", cookie),
            fetchInternalAPI("/api/improvement_areas", cookie),
        ]);

        let contextPrompt = '';
        const budgetKeywords = ["anggaran", "budget"];
        const breakdownKeywords = ["pengeluaran", "expense"];
        const improvementKeywords = ["tips", "saran", "memperbaiki", "improve", "improvement"];

        if(budgetKeywords.some(budgetKeywords => message.toLowerCase().includes(budgetKeywords))){
            contextPrompt = `
            Financial Overview : 
            - Total Budget : Rp${overview.total_budget}
            - Total Pengeluaran : Rp${overview.total_spent}
            - Sisa Budget : Rp${overview.remaining_budget}
            `;
        } else if(breakdownKeywords.some(breakdown => message.toLowerCase().includes(breakdownKeywords))){
            contextPrompt = `
            Expense Breakdown :
            ${breakdown.items.map(
                (item : any) =>
                    `- ${item.type} : Rp${item.amount} (${item.percentage.toFixed(1)})%`
            ).join("\n")}
            `;
        } else if(improvementKeywords.some(improvementKeywords => message.toLowerCase().includes(improvementKeywords))){
            contextPrompt = `
            Tips Sebelumnya :
            "${tip.tip}"
            `;
        } else {
            contextPrompt = `
            Ini adalah asisten keuangan yang membantu anda dengan data keuangan bulanan.
            Namun, saya bisa membantu anda dengan berbagai informasi lain, seperti :
            - Cara Menghemat Uang
            - Menyusun Anggaran
            - Memberikan Tips Keuangan Pribadi
            - Dan lainnya

            Jika ada pertanyaan di luar topik keuangan, saya akan mencoba membantu sebaik mungkin. Silakan tanyakan sesuatu!

            Pertanyaan Pengguna :
            "${message}"

            Harap beri jawaban ramah dan tidak mengabaikan konteks jika memungkinkan.
            `;
        }

        const stream = await openai.chat.completions.create({
        model: 'deepseek/deepseek-prover-v2:free',
        stream : true,
        messages: [
            { role: 'system', content: 'Kamu adalah asisten keuangan yang cerdas dan teliti.' },
            { role: 'user', content: contextPrompt },
        ],
        temperature : 0.7,
        });

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller){
                for await (const chunk of stream){
                    const content = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(encoder.encode(content));
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers : {
                "Content-Type" : "text/plain ; charset=utf-8",
                "Cache-Control" : "no-cache",
            },
        });
    } catch(error){
        console.error("AI Streaming Error", error);
        return new Response("Gagal menghasilkan jawaban AI.", {status : 500});
    }
}