import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    try{
        const session = await getUserSession();
        console.log('Session : ', session);
        console.log('User ID : ', session.id);

        if(!session || !session.id){
            alert("Unauthorized User!");
            return NextResponse.json({error: "Unauthorized"}, {status : 401});
        }

        const struk_scanned = await prisma.struk_scanned.findMany({
            where:{
                user_id: session.id,
            },
            select:{
                id: true,
                uploadedAt : true,
                type:true,
                amount:true
            }
        });

        return NextResponse.json(struk_scanned);
    }catch(error){
        console.error("Error Fetching Data :  ", error)
        return NextResponse.json({error : error}, {status: 500});
    } 
}