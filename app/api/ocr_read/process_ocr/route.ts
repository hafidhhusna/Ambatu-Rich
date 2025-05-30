import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { cleanOCRText } from '@/lib/cleanOCR';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json(); // pastikan destructuring benar

    if(!id){
      return NextResponse.json({error : 'ID transaksi diperlukan'}, {status : 400});
    }

    const record = await prisma.struk_scanned.findUnique({
      where:{id},
    });

    if(!record){
      return NextResponse.json({error : 'Transaksi Tidak Ditemukan'}, {status : 404});
    };

    const {prompt, cleanAIResponse} = cleanOCRText(record.extracted_text || '');

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

