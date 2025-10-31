import { MongoClient } from "mongodb";

// Direct MongoDB URI (without .env)
const uri = "mongodb+srv://anshukumarbth1_db_user:excel123@cluster0.k3hbqan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database Name
const dbName = "clubexcel";

if (!uri) {
  throw new Error("❌ MongoDB connection URI missing!");
}

const options = {
  // `useNewUrlParser`, `useUnifiedTopology`, and `keepAlive` are no longer needed
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds timeout
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Prevent multiple connections in dev mode (Next.js hot reload fix)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Function to get the database instance
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
