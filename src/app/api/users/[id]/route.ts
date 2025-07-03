import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Define MongoDB error type
interface MongoDBError extends Error {
  code?: number;
}

// Helper to extract user ID from request URL
function extractUserId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments.pop() || segments.pop(); // Handles trailing slash
  return id ?? null;
}

// GET - Fetch a single user by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const id = extractUserId(request);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT - Update a user by ID
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const id = extractUserId(request);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const { name, email, age } = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, age },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    if (error instanceof Error && (error as MongoDBError).code === 11000) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const id = extractUserId(request);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
