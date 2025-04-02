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
    try {
      const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Backend API error, falling back to direct MongoDB connection');
    }

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
      
      // Return user data and token
      return NextResponse.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        vendor: vendorData
      });
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}
