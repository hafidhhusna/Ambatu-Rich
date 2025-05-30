import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has a password (might be a social login)
    if (!user.password) {
      return NextResponse.json(
        {
          message:
            'This account cannot be accessed with a password. Please use social login.',
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Sign in successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign in' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
