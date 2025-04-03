import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export async function GET(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  const params = context.params;
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      const imageId = params.id;
      
      // Validate ObjectId
      if (!ObjectId.isValid(imageId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid image ID' },
          { status: 400 }
        );
      }
      
      // Find image in collection
      const bikerentDb = client.db('bikerent');
      const image = await bikerentDb.collection('images').findOne({ _id: new ObjectId(imageId) });
      
      if (!image) {
        return NextResponse.json(
          { success: false, message: 'Image not found' },
          { status: 404 }
        );
      }
      
      // Return image data
      return NextResponse.json({
        success: true,
        data: {
          imageData: image.imageData,
          caption: image.caption
        }
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while retrieving the image' },
      { status: 500 }
    );
  }
}
