import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { cleanOCRText } from '@/lib/cleanOCR';

export async function POST(req: NextRequest) {
  try {
    const { ocrText } = await req.json(); // ✅ pastikan destructuring benar

    if (typeof ocrText !== 'string') {
      return NextResponse.json({ error: 'ocrText harus berupa string' }, { status: 400 });
    }

    const { prompt, cleanAIResponse, getSummary } = cleanOCRText(ocrText); // ✅ sekarang inputnya string, aman

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-prover-v2:free',
      messages: [
        { role: 'system', content: 'Kamu adalah asisten keuangan yang cerdas dan teliti.' },
        { role: 'user', content: `Berikut daftar transaksi saya:\n${prompt}\n\nTolong beri saran keuangan.` },
      ],
    });
    console.log("Completion : ", completion.choices[0].message!)

    const reply = cleanAIResponse(completion.choices[0].message.content!);
    return NextResponse.json({ result: reply });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan' }, { status: 500 });
  }
}

