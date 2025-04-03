import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { loadEnvVariables } from '@/lib/env';

// Load environment variables
loadEnvVariables();

// MongoDB connection URI with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// API route handler for GET request - list all available bikes
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URI);
    
    try {
      // Create a query filter
      const filter: any = { 
        availabilityStatus: 'Available',
        isActive: true
      };
      
      // Add category filter if provided
      if (category && category !== 'all') {
        filter.category = { $regex: new RegExp(category, 'i') };
      }
      
      // Add price filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.dailyRate = {};
        if (minPrice !== undefined) {
          filter.dailyRate.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          filter.dailyRate.$lte = maxPrice;
        }
      }
      
      // Search in both databases and combine results
      const bikerentDb = client.db('bikerent');
      const bikerentBikes = await bikerentDb.collection('bikes').find(filter).toArray();
      
      const testDb = client.db('test');
      const testBikes = await testDb.collection('bikes').find(filter).toArray();
      
      // Combine and format the results
      const allBikes = [...bikerentBikes, ...testBikes].map(bike => ({
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
        images: bike.images && bike.images.length > 0 
          ? bike.images.map((img: any) => ({ url: img.url, caption: img.caption }))
          : [{ 
              url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              caption: bike.name
            }]
      }));
      
      return NextResponse.json({
        success: true,
        count: allBikes.length,
        data: allBikes
      });
      
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
