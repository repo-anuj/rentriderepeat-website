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

// API route handler for GET request - list all bikes for a vendor
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
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Get vendor details
      let vendorId;
      
      // Check in both databases for the vendor
      // First try test database
      const testDb = client.db('test');
      const testVendor = await testDb.collection('vendors').findOne({ user: new ObjectId(userId) });
      
      if (testVendor) {
        vendorId = testVendor._id;
        
        // Get bikes from test database
        const bikes = await testDb.collection('bikes').find({ vendor: vendorId }).toArray();
        
        return NextResponse.json({
          success: true,
          data: bikes
        });
      }
      
      // If not found, check bikerent database
      const bikerentDb = client.db('bikerent');
      const bikerentVendor = await bikerentDb.collection('vendors').findOne({ user: new ObjectId(userId) });
      
      if (bikerentVendor) {
        vendorId = bikerentVendor._id;
        
        // Get bikes from bikerent database
        const bikes = await bikerentDb.collection('bikes').find({ vendor: vendorId }).toArray();
        
        return NextResponse.json({
          success: true,
          data: bikes
        });
      }
      
      // If no vendor found in either database
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching bikes' },
      { status: 500 }
    );
  }
}

// API route handler for POST request - add a new bike
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
    
    // Parse request body
    const bikeData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'brand', 'model', 'year', 'description', 'engineCapacity', 'dailyRate', 'securityDeposit'];
    for (const field of requiredFields) {
      if (!bikeData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Get vendor details
      let vendorId;
      let dbToUse;
      
      // Check in both databases for the vendor
      // First try test database
      const testDb = client.db('test');
      const testVendor = await testDb.collection('vendors').findOne({ user: new ObjectId(userId) });
      
      if (testVendor) {
        vendorId = testVendor._id;
        dbToUse = testDb;
      } else {
        // If not found, check bikerent database
        const bikerentDb = client.db('bikerent');
        const bikerentVendor = await bikerentDb.collection('vendors').findOne({ user: new ObjectId(userId) });
        
        if (bikerentVendor) {
          vendorId = bikerentVendor._id;
          dbToUse = bikerentDb;
        } else {
          // If no vendor found in either database
          return NextResponse.json(
            { success: false, message: 'Vendor not found' },
            { status: 404 }
          );
        }
      }
      
      // Create bike object with properly formatted data
      const newBike = {
        vendor: vendorId,
        name: bikeData.name,
        category: bikeData.category,
        brand: bikeData.brand,
        model: bikeData.model,
        year: parseInt(bikeData.year),
        description: bikeData.description,
        engineCapacity: parseInt(bikeData.engineCapacity),
        fuelType: bikeData.fuelType || 'Petrol',
        mileage: bikeData.mileage ? parseFloat(bikeData.mileage) : undefined,
        condition: bikeData.condition || 'Good',
        dailyRate: parseFloat(bikeData.dailyRate),
        weeklyRate: bikeData.weeklyRate ? parseFloat(bikeData.weeklyRate) : undefined,
        monthlyRate: bikeData.monthlyRate ? parseFloat(bikeData.monthlyRate) : undefined,
        securityDeposit: parseFloat(bikeData.securityDeposit),
        features: Array.isArray(bikeData.features) ? bikeData.features : [],
        availabilityStatus: 'Available',
        insuranceAvailable: bikeData.insuranceAvailable || false,
        insuranceDetails: bikeData.insuranceDetails || {},
        location: bikeData.location || {
          type: 'Point',
          coordinates: [0, 0],
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        // Process images if provided
        images: bikeData.images ? bikeData.images.map((img: any) => {
          // Keep only the URL and caption to avoid storing large base64 data in bike document
          // The base64 data is already stored in the images collection
          return {
            url: img.url,
            caption: img.caption || ''
          };
        }) : [],
        ratings: [],
        averageRating: 0,
        totalBookings: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert bike into the database
      const result = await dbToUse.collection('bikes').insertOne(newBike);
      
      return NextResponse.json({
        success: true,
        message: 'Bike added successfully',
        data: {
          _id: result.insertedId,
          ...newBike
        }
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error adding bike:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while adding the bike' },
      { status: 500 }
    );
  }
}
