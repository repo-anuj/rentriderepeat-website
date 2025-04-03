import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { createHmac } from 'crypto';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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

// API route handler for POST request - upload image
export async function POST(request: NextRequest) {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const userId = verifySessionToken(token);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const imageBase64 = formData.get('image') as string;
    const caption = formData.get('caption') as string || '';
    
    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: 'No image data provided' },
        { status: 400 }
      );
    }
    
    // Save image to MongoDB
    const imageDoc = {
      userId: new ObjectId(userId),
      imageData: imageBase64,
      caption: caption,
      uploadedAt: new Date()
    };
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      const bikerentDb = client.db('bikerent');
      const result = await bikerentDb.collection('images').insertOne(imageDoc);
      
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          _id: result.insertedId,
          url: `api/vendor/images/${result.insertedId}`,
          caption: caption
        }
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while uploading the image' },
      { status: 500 }
    );
  }
}
