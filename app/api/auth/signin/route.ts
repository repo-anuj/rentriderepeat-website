import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { loadEnvVariables } from '@/lib/env';
import { createHmac } from 'crypto';

// Load environment variables from backend/.env
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Simple function to create a session token
function createSessionToken(userId: string, role: string): string {
  const jwtSecret = process.env.JWT_SECRET || 'a7c4b3f9d8e2a1b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8';
  const timestamp = Date.now();
  // Create a simple hash using the secret
  const hash = createHmac('sha256', jwtSecret)
    .update(`${userId}_${role}_${timestamp}`)
    .digest('hex');
  return `${userId}_${role}_${timestamp}_${hash.substring(0, 10)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try to connect to backend API first
    // Skip backend API attempt and go directly to MongoDB
    // This is a temporary solution until the backend server is set up
    console.log('Skipping backend API attempt and using direct MongoDB connection');

    // Fallback to direct MongoDB connection if backend API fails
    const client = await MongoClient.connect(MONGO_URI);

    try {
      // Check in both databases for the user
      let user = null;
      let dbName = '';

      // First check in 'bikerent' database
      const bikerentDb = client.db('bikerent');
      user = await bikerentDb.collection('users').findOne({ email });

      if (user) {
        dbName = 'bikerent';
      } else {
        // If not found, check in 'test' database
        const testDb = client.db('test');
        user = await testDb.collection('users').findOne({ email });
        if (user) {
          dbName = 'test';
        }
      }

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Check if user is a vendor
      let vendorData = null;
      if (user.role === 'vendor') {
        const db = client.db(dbName);
        vendorData = await db.collection('vendors').findOne({ user: user._id });
      }

      // Generate token
      const token = createSessionToken(user._id.toString(), user.role);

      // Create response with user data and token
      const response = NextResponse.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          isVerified: user.isVerified || false,
          createdAt: user.createdAt || new Date().toISOString(),
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          bio: user.bio || ''
        },
        vendor: vendorData
      });

      // Set token in a cookie (30 days expiry)
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/'
      });

      return response;
    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Error in signin:', error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
    const errorStack = error instanceof Error ? error.stack : '';

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          stack: errorStack,
          mongoUri: MONGO_URI ? MONGO_URI.substring(0, 20) + '...' : 'Not defined'
        } : undefined
      },
      { status: 500 }
    );
  }
}
