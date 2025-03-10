// import { authOptions } from "@/lib/auth";
import {session} from '@/lib/session';
import { prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { use } from "react";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOptions : NextAuthOptions = {
    session : {
        strategy: 'jwt'
    },
    providers: [
        GoogleProvider({
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({account, profile}) {
            if(!profile?.email){
                throw new Error('No Profile')
            }
            const profilePicture = (profile as any).picture
            const email_verified = (profile as any).email_verified
            console.log(profile)
            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create:{
                    email: profile.email,
                    name: profile.name,
                    image: profilePicture,
                    emailVerified: email_verified,
                },
                update:{
                    name:profile.name,
                    image: profilePicture,
                    emailVerified: email_verified,
                },
            })

            return true
        },
        session,
        async jwt({token, user, account, profile}){
            if(profile){
                const user = await prisma.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                })
                if(!user){
                    throw new Error('No User Found')
                }
                token.id = user.id
            }
            return token
        },
    },
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
