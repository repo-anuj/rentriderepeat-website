import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from './mongodb';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    try {
      // Send the data to the backend API
      const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await backendResponse.json();
      
      if (!backendResponse.ok) {
        return NextResponse.json(
          { success: false, error: data.error || 'Registration failed' },
          { status: backendResponse.status }
        );
      }
      
      return NextResponse.json(data, { status: 201 });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError);
      
      // For development purposes, store the user data directly in MongoDB
      // This is a temporary solution until the backend is running
      try {
        // Save user data directly to MongoDB as a fallback
        const result = await registerUser(userData);
        
        return NextResponse.json(result, { status: 201 });
      } catch (dbError: any) {
        console.error('Direct DB connection error:', dbError);
        return NextResponse.json(
          { success: false, error: dbError.message || 'Backend server is not running and direct DB connection failed' },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
