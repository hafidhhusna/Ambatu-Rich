import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession();

    if (!session || !session.id || !session.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, username, image } = await request.json();

    console.log('Profile update request:', {
      name,
      username,
      imageLength: image ? image.length : 0,
      hasImage: !!image,
    });

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return NextResponse.json(
        {
          message:
            'Username can only contain letters, numbers, and underscores',
        },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser && existingUser.email !== session.email) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Validate image size if provided (base64 images can be very large)
    if (image && image.length > 10 * 1024 * 1024) {
      // ~7.5MB for base64
      return NextResponse.json(
        { message: 'Image size is too large. Please use a smaller image.' },
        { status: 400 }
      );
    }

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.email },
      data: {
        name: name.trim(),
        username: username.trim(),
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
      },
    });

    console.log('Profile updated successfully:', {
      userId: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      hasImage: !!updatedUser.image,
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);

    // Handle specific Prisma errors
    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('String too long')) {
      return NextResponse.json(
        { message: 'Image data is too large for database storage' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
