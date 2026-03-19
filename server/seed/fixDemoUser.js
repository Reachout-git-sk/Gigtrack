import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function fix() {
  try {
    await client.connect();
    const db = client.db("gigtrack");

    // Delete old broken seed user
    await db.collection("users").deleteOne({ email: "seed@gigtrack.com" });

    // Create new one with proper bcrypt hash
    const passwordHash = await bcrypt.hash("demo1234", 10);
    await db.collection("users").insertOne({
      name: "Demo User",
      email: "seed@gigtrack.com",
      passwordHash,
      createdAt: new Date(),
    });

    console.log("✅ Demo user fixed. Login with seed@gigtrack.com / demo1234");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

fix();