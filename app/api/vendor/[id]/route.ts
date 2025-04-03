import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// API route handler for GET request - get a specific vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Create the ObjectId
      const vendorId = new ObjectId(id);
      
      // Search in both databases for the vendor
      const bikerentDb = client.db('bikerent');
      let vendor = await bikerentDb.collection('users').findOne({ 
        _id: vendorId,
        role: 'vendor'
      });
      
      // If not found in bikerent database, check test database
      if (!vendor) {
        const testDb = client.db('test');
        vendor = await testDb.collection('users').findOne({ 
          _id: vendorId,
          role: 'vendor'
        });
      }
      
      // If vendor not found in either database
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: 'Vendor not found' },
          { status: 404 }
        );
      }
      
      // Format the vendor data
      const formattedVendor = {
        id: vendor._id.toString(),
        name: vendor.name || vendor.username || 'Unknown Vendor',
        email: vendor.email,
        phone: vendor.phone || 'Not provided',
        address: vendor.address || 'Not provided',
        city: vendor.city || 'Not provided',
        gstNumber: vendor.gstNumber || vendor.gst || 'Not registered',
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt
      };
      
      return NextResponse.json({
        success: true,
        data: formattedVendor
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching the vendor details' },
      { status: 500 }
    );
  }
}
