import { NextRequest, NextResponse } from 'next/server';
import { getUserData, getVendorData } from '@/lib/auth';
import { loadEnvVariables } from '@/lib/env';
import { createHmac } from 'crypto';

// Load environment variables
loadEnvVariables();

// Simple function to verify a session token
function verifySessionToken(token: string): string | null {
  try {
    // Token format: userId_role_timestamp_hash
    const parts = token.split('_');
    if (parts.length < 4) return null;

    const userId = parts[0];
    const role = parts[1];
    const timestamp = parts[2];
    const receivedHash = parts[3];

    // Verify the hash
    const jwtSecret = process.env.JWT_SECRET || 'a7c4b3f9d8e2a1b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8';
    const expectedHash = createHmac('sha256', jwtSecret)
      .update(`${userId}_${role}_${timestamp}`)
      .digest('hex')
      .substring(0, 10);

    if (receivedHash !== expectedHash) return null;

    // Check if token is expired (30 days)
    const expirationTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();

    if (currentTime - tokenTime > expirationTime) return null;

    return userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from authorization header or cookies
    let token = null;

    // Try to get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If no token in header, try cookies
    if (!token) {
      token = request.cookies.get('token')?.value;
    }

    // If still no token, check localStorage via a custom header
    if (!token) {
      token = request.headers.get('x-auth-token');
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const userId = verifySessionToken(token);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user data from MongoDB
    const userData = await getUserData(userId);

    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // If user is a vendor, get vendor data as well
    let vendorData = null;
    if (userData.role === 'vendor') {
      vendorData = await getVendorData(userId);
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: userData,
      vendor: vendorData
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
