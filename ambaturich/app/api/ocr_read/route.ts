import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { cleanOCRText } from '@/lib/cleanOCR';

export async function POST(req: NextRequest) {
  try {
    const { ocrText } = await req.json();
    const { prompt } = cleanOCRText(ocrText);

    const completion = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: [
        { role: 'system', content: 'Kamu adalah asisten keuangan yang cerdas dan teliti.' },
        { role: 'user', content: `Berikut daftar transaksi saya:\n${prompt}\n\nTolong beri saran keuangan.` },
      ],
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ result: reply });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server.' }, { status: 500 });
  }
}
