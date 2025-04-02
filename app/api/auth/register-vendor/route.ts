import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { registerVendorDirectly } from './mongodb';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables from backend/.env
loadEnvVariables();

// Simple function to create a session token
function createSessionToken(userId: string): string {
  // In a real app, you'd use a proper JWT implementation with the JWT_SECRET from backend/.env
  // This is a simplified version for demonstration
  const jwtSecret = process.env.JWT_SECRET || 'a7c4b3f9d8e2a1b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  // Create a simple hash using the secret
  const hash = require('crypto')
    .createHmac('sha256', jwtSecret)
    .update(`${userId}_${timestamp}`)
    .digest('hex');
  return `${userId}_${timestamp}_${hash.substring(0, 10)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      mobile, 
      businessName, 
      businessType, 
      gstNumber, 
      bikeCount, 
      businessAddress, 
      description, 
      panCard, 
      aadharCard, 
      businessLicense, 
      emergencyContact, 
      bankAccount 
    } = body;

    // Validate required fields
    if (!name || !email || !password || !mobile || !businessName || !businessType || !businessAddress) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to connect to backend API first
    try {
      const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/register/vendor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: mobile,
          businessName,
          businessType,
          businessAddress,
          gstNumber,
          panNumber: panCard,
          bikeCount,
          description,
          aadharCard,
          businessLicense,
          emergencyContact,
          bankAccount
        }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Backend API error, falling back to direct MongoDB connection');
    }

    // Fallback to direct MongoDB connection if backend API fails
    await connectMongoDB();
    
    // Register vendor directly in MongoDB
    const result = await registerVendorDirectly({
      name,
      email,
      password,
      mobile,
      businessName,
      businessType,
      gstNumber,
      bikeCount,
      businessAddress,
      description,
      panCard,
      aadharCard,
      businessLicense,
      emergencyContact,
      bankAccount
    });

    // Generate a simple session token
    const token = createSessionToken(result.user._id.toString());

    return NextResponse.json(
      { 
        message: 'Vendor registered successfully', 
        success: true, 
        token,
        data: result 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in vendor registration:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration', success: false },
      { status: 500 }
    );
  }
}
