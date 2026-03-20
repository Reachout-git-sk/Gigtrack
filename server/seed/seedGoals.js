import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const GOAL_LABELS = [
  "January hustle",
  "February grind",
  "March momentum",
  "April earnings",
  "May income push",
  "June side hustle",
  "July income goal",
  "August earnings",
  "September target",
  "October hustle",
  "November income",
  "December push",
];

const PAYOUT_SOURCES = [
  "DoorDash",
  "UberEats",
  "Tutoring client",
  "Freelance design",
  "Retail shift",
  "Campus job",
  "Photography gig",
  "Dog walking",
  "Data entry",
  "Event staffing",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInMonth(year, month) {
  const day = randomInt(1, 28);
  return new Date(year, month - 1, day);
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("gigtrack");

    // Find the demo user
    const seedUser = await db
      .collection("users")
      .findOne({ email: "seed@gigtrack.com" });

    if (!seedUser) {
      console.error(
        "❌ Demo user not found. Run seedGigs.js first to create the demo user."
      );
      process.exit(1);
    }

    console.log(`✅ Found demo user: ${seedUser._id}`);

    const goalsCollection = db.collection("goals");

    // Delete only this user's existing goals
    await goalsCollection.deleteMany({ userId: seedUser._id });

    const goals = [];

    // 12 months x 7 repeats = 84 goals across 2024
    for (let repeat = 0; repeat < 84; repeat++) {
      const monthNum = (repeat % 12) + 1;
      const year = 2024;
      const monthStr = `${year}-${String(monthNum).padStart(2, "0")}`;
      const targetAmount = randomInt(800, 3000);

      const numPayouts = randomInt(2, 6);
      const payouts = [];

      for (let p = 0; p < numPayouts; p++) {
        const amount = randomInt(100, 800);
        payouts.push({
          _id: new ObjectId(),
          source: randomItem(PAYOUT_SOURCES),
          amount,
          date: randomDateInMonth(year, monthNum),
          status: randomItem(["received", "received", "pending"]),
        });
      }

      goals.push({
        userId: seedUser._id, // ← attached to demo user
        label: GOAL_LABELS[monthNum - 1],
        targetAmount,
        month: monthStr,
        payouts,
        createdAt: new Date(),
      });
    }

    await goalsCollection.insertMany(goals);
    console.log(`✅ Seeded ${goals.length} goal records for demo user`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();