import {
  getFinancialOverview,
  getExpenseBreakdown,
  getImprovementAreas,
} from '@/lib/analytics_ai_assistant';
import openai from '@/lib/openai';
import { read } from 'fs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    console.log('🤖 AI Assistant request:', { message });

    // Use direct database functions instead of HTTP calls
    const [overview, breakdown, tip] = await Promise.all([
      getFinancialOverview(),
      getExpenseBreakdown(),
      getImprovementAreas(),
    ]);

    console.log('📊 Data fetched successfully:', {
      overview: !!overview,
      breakdown: !!breakdown,
      tip: !!tip,
    });

    let contextPrompt = '';
    const budgetKeywords = ['anggaran', 'budget', 'performa'];
    const breakdownKeywords = ['pengeluaran', 'expense'];
    const improvementKeywords = [
      'tips',
      'saran',
      'memperbaiki',
      'improve',
      'improvement',
    ];

    if (
      budgetKeywords.some((budgetKeywords) =>
        message.toLowerCase().includes(budgetKeywords)
      )
    ) {
      contextPrompt = `
            Financial Overview : 
            - Total Budget : Rp${overview.total_budget}
            - Total Pengeluaran : Rp${overview.total_spent}
            - Sisa Budget : Rp${overview.remaining_budget}
            `;
    } else if (
      breakdownKeywords.some((breakdown) =>
        message.toLowerCase().includes(breakdownKeywords)
      )
    ) {
      contextPrompt = `
            Expense Breakdown :
            ${breakdown.items
              .map(
                (item: any) =>
                  `- ${item.type} : Rp${item.amount} (${item.percentage.toFixed(
                    1
                  )})%`
              )
              .join('\n')}
            `;
    } else if (
      improvementKeywords.some((improvementKeywords) =>
        message.toLowerCase().includes(improvementKeywords)
      )
    ) {
      contextPrompt = `
            Beberapa Saran Pengeluaran Bulanan:
            ${tip
              .map((item: any) => `- Kategori ${item.category}: ${item.tip}`)
              .join('\n')}
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

            Harap beri jawaban ramah dan tidak mengabaikan konteks jika memungkinan.
            `;
    }

    console.log('💭 Context prompt generated:', {
      length: contextPrompt.length,
    });

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah asisten keuangan yang cerdas dan teliti.',
        },
        {
          role: 'user',
          content: `Berikut adalah data keuangan saya:\n${contextPrompt}`,
        },
        {
          role: 'user',
          content: message, // pertanyaan pengguna asli
        },
      ],
      temperature: 0.7,
    });

    console.log('🚀 OpenAI stream created successfully');

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
          console.log('✅ AI streaming completed successfully');
        } catch (error) {
          console.error('💥 Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain ; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('💥 AI Streaming Error', error);
    return new Response('Gagal menghasilkan jawaban AI.', { status: 500 });
  }
}
