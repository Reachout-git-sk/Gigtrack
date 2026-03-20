import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const GIG_TYPES = ["tutoring", "delivery", "design", "retail", "other"];
const RATE_TYPES = ["hourly", "flat"];
const STATUSES = ["completed", "in-progress", "unpaid"];

const CLIENT_NAMES = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Brown",
  "Emma Davis",
  "Frank Miller",
  "Grace Wilson",
  "Henry Moore",
  "Isabella Taylor",
  "James Anderson",
  "Karen Thomas",
  "Liam Jackson",
  "Mia Harris",
  "Noah Martin",
  "Olivia Lee",
  "Peter Walker",
  "Quinn Hall",
  "Rachel Allen",
  "Samuel Young",
  "Tara King",
];

const GIG_TITLES = {
  tutoring: [
    "Math tutoring",
    "Physics help",
    "SAT prep",
    "Calculus session",
    "Chemistry review",
  ],
  delivery: [
    "DoorDash shift",
    "UberEats delivery",
    "Grocery run",
    "Package delivery",
    "Food delivery",
  ],
  design: [
    "Logo design",
    "UI mockup",
    "Banner design",
    "Brand kit",
    "Social media graphics",
  ],
  retail: [
    "Weekend shift",
    "Holiday cover",
    "Evening shift",
    "Morning shift",
    "Stock room help",
  ],
  other: [
    "Event setup",
    "Dog walking",
    "Photography",
    "Video editing",
    "Data entry",
  ],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate() {
  const start = new Date("2024-01-01");
  const end = new Date("2024-12-31");
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("gigtrack");

    // Create a dummy user for seeded gigs
    const usersCollection = db.collection("users");
    let seedUser = await usersCollection.findOne({
      email: "seed@gigtrack.com",
    });

    if (!seedUser) {
      const passwordHash = await bcrypt.hash("demo1234", 10);
      const result = await usersCollection.insertOne({
        name: "Demo User",
        email: "seed@gigtrack.com",
        passwordHash,
        createdAt: new Date(),
      });
      seedUser = { _id: result.insertedId };
    }

    const gigsCollection = db.collection("gigs");
    await gigsCollection.deleteMany({ userId: seedUser._id });

    const gigs = [];

    for (let i = 0; i < 1000; i++) {
      const gigType = randomItem(GIG_TYPES);
      const rateType = randomItem(RATE_TYPES);
      const rate = randomInt(15, 120);
      const hoursWorked = rateType === "hourly" ? randomInt(1, 8) : 0;
      const earnings = rateType === "hourly" ? rate * hoursWorked : rate;

      gigs.push({
        userId: seedUser._id,
        title: randomItem(GIG_TITLES[gigType]),
        clientName: randomItem(CLIENT_NAMES),
        gigType,
        date: randomDate(),
        hoursWorked,
        rate,
        rateType,
        earnings,
        clientRating: randomInt(1, 5),
        clientNote:
          randomInt(0, 1) === 1 ? "Good client, would work again." : "",
        status: randomItem(STATUSES),
        createdAt: new Date(),
      });
    }

    await gigsCollection.insertMany(gigs);
    console.log("✅ Seeded 1000 gig records successfully");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();
