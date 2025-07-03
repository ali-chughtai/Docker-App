import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Define MongoDB error type
interface MongoDBError extends Error {
  code?: number;
}

// GET - Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: unknown) {
    // Narrow the type of error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, age } = body;

    // Validate required fields
    if (!name || !email || !age) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and age are required',
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      age,
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle MongoDB duplicate key error
    if (error instanceof Error && (error as MongoDBError).code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}