import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// Connection URI
const uri = process.env.MONGO_URI || "mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Verify session token function
function verifySessionToken(token: string): string | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
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
    
    // Connect to MongoDB
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('bikerent');
      
      // Find user documents
      const userDocuments = await db.collection('userDocuments').findOne({
        userId: new ObjectId(userId)
      });
      
      if (!userDocuments) {
        return NextResponse.json({
          success: true,
          message: 'No documents found for this user',
          data: null
        });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          aadharCardImage: userDocuments.aadharCardImage,
          drivingLicenseImage: userDocuments.drivingLicenseImage
        }
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching user documents' },
      { status: 500 }
    );
  }
}
