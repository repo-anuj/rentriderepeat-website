import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Connection URI
const uri = process.env.MONGO_URI || "mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('bikerent');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function registerUser(userData: any) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const documentsCollection = db.collection('userDocuments');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Extract document images from userData
  const { aadharCardImage, drivingLicenseImage, ...userDataWithoutImages } = userData;

  // Prepare user data
  const user = {
    ...userDataWithoutImages,
    password: hashedPassword,
    role: 'user',
    isVerified: false,
    profilePicture: 'default.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Insert user
  const result = await usersCollection.insertOne(user);
  const userId = result.insertedId.toString();

  // Store document images separately
  if (aadharCardImage || drivingLicenseImage) {
    await documentsCollection.insertOne({
      userId: result.insertedId,
      aadharCardImage: aadharCardImage || null,
      drivingLicenseImage: drivingLicenseImage || null,
      uploadedAt: new Date()
    });
  }

  // Remove password from return object
  const { password, ...userWithoutPassword } = user;

  return {
    success: true,
    data: {
      user: userWithoutPassword,
      token: generateToken(userId)
    }
  };
}

function generateToken(userId: string) {
  // This is a simplified token generation
  // In production, use a proper JWT library
  return Buffer.from(JSON.stringify({
    id: userId,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  })).toString('base64');
}
