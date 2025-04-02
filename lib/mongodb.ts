import { MongoClient } from 'mongodb';
import { loadEnvVariables } from './env';

// Load environment variables from backend/.env
loadEnvVariables();

// Use the MongoDB URI from environment variables
const uri = process.env.MONGO_URI || 'mongodb+srv://00a20j50:anuj1212@cluster0.fkwuauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('MongoDB URI is not defined');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function connectMongoDB() {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Unable to connect to MongoDB');
  }
}
