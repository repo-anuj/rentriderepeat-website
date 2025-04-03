import { MongoClient, ObjectId } from 'mongodb';
import { loadEnvVariables } from './env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export type VendorData = {
  _id: string;
  businessName: string;
  isVerified: boolean;
  user: string | ObjectId;
}

// Get user data from MongoDB
export async function getUserData(userId: string): Promise<UserData | null> {
  const client = await MongoClient.connect(MONGO_URI);
  
  try {
    // Check in both databases for the user
    let user = null;
    
    // First check in 'bikerent' database
    const bikerentDb = client.db('bikerent');
    user = await bikerentDb.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      // If not found, check in 'test' database
      const testDb = client.db('test');
      user = await testDb.collection('users').findOne({ _id: new ObjectId(userId) });
    }
    
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  } finally {
    await client.close();
  }
}

// Get vendor data from MongoDB
export async function getVendorData(userId: string): Promise<VendorData | null> {
  const client = await MongoClient.connect(MONGO_URI);
  
  try {
    // Check in both databases for the vendor
    let vendor = null;
    
    // Try test database first (where vendor data is likely stored)
    const testDb = client.db('test');
    vendor = await testDb.collection('vendors').findOne({ user: new ObjectId(userId) });
    
    if (!vendor) {
      // If not found, check in 'bikerent' database
      const bikerentDb = client.db('bikerent');
      vendor = await bikerentDb.collection('vendors').findOne({ user: new ObjectId(userId) });
    }
    
    if (!vendor) {
      return null;
    }
    
    return {
      _id: vendor._id.toString(),
      businessName: vendor.businessName,
      isVerified: vendor.isVerified || false,
      user: vendor.user.toString()
    };
    
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    return null;
  } finally {
    await client.close();
  }
}

// Create API endpoint URL for authentication
export function getAuthApiUrl(endpoint: string): string {
  return `/api/auth/${endpoint}`;
}
