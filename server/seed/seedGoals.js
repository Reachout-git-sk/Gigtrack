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

    const goalsCollection = db.collection("goals");
    await goalsCollection.deleteMany({});

    const goals = [];

    // Generate goals for each month of 2024 — repeat to get 1000+ records
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
        label: GOAL_LABELS[monthNum - 1],
        targetAmount,
        month: monthStr,
        payouts,
        createdAt: new Date(),
      });
    }

    await goalsCollection.insertMany(goals);
    console.log(`✅ Seeded ${goals.length} goal records successfully`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();
