import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receiptId = params.id;

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { type, amount, date, name } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    // Build update data object with only provided fields
    const updateData: any = {};

    if (type) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (date) updateData.uploadedAt = new Date(date);
    if (name) updateData.name = name;

    // Update the receipt record
    const updatedReceipt = await prisma.struk_scanned.update({
      where: { id: receiptId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedReceipt,
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    return NextResponse.json(
      { error: 'Error updating receipt' },
      { status: 500 }
    );
  }
}

// Get a specific receipt by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receiptId = params.id;

    if (!receiptId) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      );
    }

    const receipt = await prisma.struk_scanned.findUnique({
      where: { id: receiptId },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { error: 'Error fetching receipt' },
      { status: 500 }
    );
  }
}
