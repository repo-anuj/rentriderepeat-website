import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// API route handler for GET request - get a specific bike by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid bike ID' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Create the ObjectId
      const bikeId = new ObjectId(id);
      
      // Search in both databases for the bike
      const bikerentDb = client.db('bikerent');
      let bike = await bikerentDb.collection('bikes').findOne({ _id: bikeId });
      
      // If not found in bikerent database, check test database
      if (!bike) {
        const testDb = client.db('test');
        bike = await testDb.collection('bikes').findOne({ _id: bikeId });
      }
      
      // If bike not found in either database
      if (!bike) {
        return NextResponse.json(
          { success: false, message: 'Bike not found' },
          { status: 404 }
        );
      }
      
      // Format the bike data
      const formattedBike = {
        id: bike._id.toString(),
        name: bike.name,
        category: bike.category,
        brand: bike.brand,
        model: bike.model,
        price: bike.dailyRate,
        securityDeposit: bike.securityDeposit,
        rating: bike.averageRating || 4.5,
        features: Array.isArray(bike.features) ? bike.features : [],
        description: bike.description,
        engineCapacity: bike.engineCapacity,
        year: bike.year,
        fuelType: bike.fuelType,
        mileage: bike.mileage,
        condition: bike.condition,
        specifications: {
          engine: `${bike.engineCapacity}cc, ${bike.fuelType || 'Petrol'}`,
          power: bike.powerOutput || 'N/A',
          torque: bike.torqueOutput || 'N/A',
          transmission: bike.transmission || '5-Speed',
          fuelCapacity: bike.fuelCapacity || 'N/A',
          weight: bike.weight || 'N/A',
          mileage: bike.mileage ? `${bike.mileage} kmpl` : 'N/A',
          seatHeight: bike.seatHeight || 'N/A'
        },
        availabilityStatus: bike.availabilityStatus,
        vendor: bike.vendor,
        insuranceAvailable: bike.insuranceAvailable,
        images: bike.images && bike.images.length > 0 
          ? bike.images.map((img: any) => ({ url: img.url, caption: img.caption }))
          : [{ 
              url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              caption: bike.name
            }]
      };
      
      return NextResponse.json({
        success: true,
        data: formattedBike
      });
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error fetching bike:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching the bike details' },
      { status: 500 }
    );
  }
}
