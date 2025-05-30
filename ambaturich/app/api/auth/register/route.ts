import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if user already exists with this username
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User registered successfully!',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
