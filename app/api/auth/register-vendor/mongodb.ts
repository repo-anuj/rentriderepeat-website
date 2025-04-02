import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables from backend/.env
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Function to register a vendor directly in MongoDB
export async function registerVendorDirectly(vendorData: any) {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db();
  
  try {
    // Check if user with this email already exists
    const existingUser = await db.collection('users').findOne({ email: vendorData.email });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(vendorData.password, salt);
    
    // Create user with vendor role
    const user = {
      name: vendorData.name,
      email: vendorData.email,
      password: hashedPassword,
      phone: vendorData.mobile,
      role: 'vendor',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userResult = await db.collection('users').insertOne(user);
    
    // Create vendor profile
    const vendor = {
      user: userResult.insertedId,
      businessName: vendorData.businessName,
      businessType: vendorData.businessType,
      businessAddress: vendorData.businessAddress,
      gstNumber: vendorData.gstNumber,
      panNumber: vendorData.panCard,
      bikeCount: parseInt(vendorData.bikeCount) || 0,
      description: vendorData.description,
      aadharCard: vendorData.aadharCard,
      businessLicense: vendorData.businessLicense,
      emergencyContact: vendorData.emergencyContact,
      bankDetails: {
        accountNumber: vendorData.bankAccount
      },
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const vendorResult = await db.collection('vendors').insertOne(vendor);
    
    // Return user data without generating JWT token here
    // The token will be generated in the API route
    return {
      success: true,
      user: {
        _id: userResult.insertedId,
        name: user.name,
        email: user.email,
        role: user.role
      },
      vendor: {
        _id: vendorResult.insertedId,
        businessName: vendor.businessName
      }
    };
  } finally {
    await client.close();
  }
}
