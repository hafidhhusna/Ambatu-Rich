import { runOCR } from "@/lib/runOCR";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cleanOCRText } from "@/lib/cleanOCR";


export async function POST(req : NextRequest){
    try{
        const {imageUrl, userId} = await req.json();

        if(!imageUrl || !userId){
            return NextResponse.json(
                {error : 'Image URL dan user ID diperlukan'},
                {status : 400}
            );
        }

        const ocrText = await runOCR(imageUrl);

        const {transaksi, cleanAIResponse, getSummary} = cleanOCRText(ocrText);

        const savedRecord = await prisma.struk_scanned.create({
            data : {
                image_url : imageUrl,
                extracted_text : ocrText,
                uploadedAt : new Date(),
                user_id : userId,
                type: getSummary(ocrText),
                amount : transaksi.reduce((sum, t) => sum + t.jumlah * t.harga, 0)
            },
        });

        console.log('Data struk : ', savedRecord);

        return NextResponse.json({success : true , data: savedRecord});
    } catch(error){
        console.error('Error Processing OCR : ', error);
        return NextResponse.json(
            {error : 'Terjadi Kesalahan Pada Server'},
            {status : 500}
        );
    }
}