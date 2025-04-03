import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { loadEnvVariables } from '@/lib/env';
import { createHmac } from 'crypto';

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
    
    // Ensure the user is a vendor
    if (role !== 'vendor') return null;
    
    return userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Helper function to find a vendor in both databases
async function findVendor(client: MongoClient, userId: string) {
  // First try test database
  const testDb = client.db('test');
  const testVendor = await testDb.collection('vendors').findOne({ user: new ObjectId(userId) });
  
  if (testVendor) {
    return { vendor: testVendor, db: testDb };
  }
  
  // If not found, check bikerent database
  const bikerentDb = client.db('bikerent');
  const bikerentVendor = await bikerentDb.collection('vendors').findOne({ user: new ObjectId(userId) });
  
  if (bikerentVendor) {
    return { vendor: bikerentVendor, db: bikerentDb };
  }
  
  return { vendor: null, db: null };
}

// Helper function to find a bike and check ownership
async function findBikeAndCheckOwnership(client: MongoClient, bikeId: string, vendorId: ObjectId) {
  // Try both databases
  const testDb = client.db('test');
  const bikerentDb = client.db('bikerent');
  
  let bike = null;
  let db = null;
  
  try {
    // Try to find bike in test database
    bike = await testDb.collection('bikes').findOne({ _id: new ObjectId(bikeId) });
    if (bike) {
      db = testDb;
    } else {
      // If not found, try bikerent database
      bike = await bikerentDb.collection('bikes').findOne({ _id: new ObjectId(bikeId) });
      if (bike) {
        db = bikerentDb;
      }
    }
    
    // Check if bike exists and belongs to the vendor
    if (!bike) {
      return { bike: null, db: null, error: 'Bike not found' };
    }
    
    // The vendor field in a bike document should be an ObjectId
    const bikeVendorId = bike.vendor instanceof ObjectId ? bike.vendor : new ObjectId(bike.vendor);
    const currentVendorId = vendorId instanceof ObjectId ? vendorId : new ObjectId(vendorId);
    
    if (!bikeVendorId.equals(currentVendorId)) {
      return { bike: null, db: null, error: 'Unauthorized access to this bike' };
    }
    
    return { bike, db, error: null };
  } catch (error) {
    console.error('Error finding bike:', error);
    return { bike: null, db: null, error: 'Error finding bike' };
  }
}

// GET a single bike
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bikeId = params.id;
    
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
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Find vendor
      const { vendor, db } = await findVendor(client, userId);
      
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: 'Vendor not found' },
          { status: 404 }
        );
      }
      
      // Find bike and check ownership
      const { bike, error } = await findBikeAndCheckOwnership(client, bikeId, vendor._id);
      
      if (error) {
        return NextResponse.json(
          { success: false, message: error },
          { status: error === 'Bike not found' ? 404 : 403 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: bike
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error fetching bike:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching the bike' },
      { status: 500 }
    );
  }
}

// UPDATE a bike
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bikeId = params.id;
    
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
    
    // Parse request body
    const updateData = await request.json();
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Find vendor
      const { vendor, db } = await findVendor(client, userId);
      
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: 'Vendor not found' },
          { status: 404 }
        );
      }
      
      // Find bike and check ownership
      const bikeResult = await findBikeAndCheckOwnership(client, bikeId, vendor._id);
      
      if (bikeResult.error) {
        return NextResponse.json(
          { success: false, message: bikeResult.error },
          { status: bikeResult.error === 'Bike not found' ? 404 : 403 }
        );
      }
      
      const { bike, db: bikeDb } = bikeResult;
      
      // Make sure we have a valid database instance
      if (!bikeDb) {
        return NextResponse.json(
          { success: false, message: 'Database error' },
          { status: 500 }
        );
      }
      
      // Prepare update data with correct types
      const updateFields: any = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // Convert numeric fields
      if (updateFields.year) updateFields.year = parseInt(updateFields.year);
      if (updateFields.engineCapacity) updateFields.engineCapacity = parseInt(updateFields.engineCapacity);
      if (updateFields.dailyRate) updateFields.dailyRate = parseFloat(updateFields.dailyRate);
      if (updateFields.weeklyRate) updateFields.weeklyRate = parseFloat(updateFields.weeklyRate);
      if (updateFields.monthlyRate) updateFields.monthlyRate = parseFloat(updateFields.monthlyRate);
      if (updateFields.securityDeposit) updateFields.securityDeposit = parseFloat(updateFields.securityDeposit);
      if (updateFields.mileage) updateFields.mileage = parseFloat(updateFields.mileage);
      
      // Update the bike
      await bikeDb.collection('bikes').updateOne(
        { _id: new ObjectId(bikeId) },
        { $set: updateFields }
      );
      
      // Get the updated bike
      const updatedBike = await bikeDb.collection('bikes').findOne({ _id: new ObjectId(bikeId) });
      
      return NextResponse.json({
        success: true,
        message: 'Bike updated successfully',
        data: updatedBike
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error updating bike:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the bike' },
      { status: 500 }
    );
  }
}

// DELETE a bike
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bikeId = params.id;
    
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
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Find vendor
      const { vendor, db } = await findVendor(client, userId);
      
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: 'Vendor not found' },
          { status: 404 }
        );
      }
      
      // Find bike and check ownership
      const bikeResult = await findBikeAndCheckOwnership(client, bikeId, vendor._id);
      
      if (bikeResult.error) {
        return NextResponse.json(
          { success: false, message: bikeResult.error },
          { status: bikeResult.error === 'Bike not found' ? 404 : 403 }
        );
      }
      
      const { bike, db: bikeDb } = bikeResult;
      
      // Make sure we have a valid database instance
      if (!bikeDb) {
        return NextResponse.json(
          { success: false, message: 'Database error' },
          { status: 500 }
        );
      }
      
      // Delete the bike
      await bikeDb.collection('bikes').deleteOne({ _id: new ObjectId(bikeId) });
      
      return NextResponse.json({
        success: true,
        message: 'Bike deleted successfully'
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error deleting bike:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the bike' },
      { status: 500 }
    );
  }
}
