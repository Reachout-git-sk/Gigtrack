import express from "express";
import { getDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Middleware — block unauthenticated requests
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  next();
}

// GET /api/gigs — get all gigs for logged in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { type, client, startDate, endDate } = req.query;

    const filter = { userId: new ObjectId(req.user._id) };

    if (type) filter.gigType = type;
    if (client) filter.clientName = { $regex: client, $options: "i" };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const gigs = await db
      .collection("gigs")
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/gigs — create a new gig
router.post("/", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      clientName,
      gigType,
      date,
      hoursWorked,
      rate,
      rateType,
      clientRating,
      clientNote,
      status,
    } = req.body;

    if (!title || !clientName || !gigType || !date || !rate || !rateType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Compute earnings server side
    const earnings = rateType === "hourly" ? rate * (hoursWorked || 0) : rate;

    const gig = {
      userId: new ObjectId(req.user._id),
      title,
      clientName,
      gigType,
      date: new Date(date),
      hoursWorked: hoursWorked || 0,
      rate,
      rateType,
      earnings,
      clientRating: clientRating || null,
      clientNote: clientNote || "",
      status: status || "completed",
      createdAt: new Date(),
    };

    const result = await db.collection("gigs").insertOne(gig);
    res.status(201).json({ message: "Gig created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/gigs/:id — update a gig
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      clientName,
      gigType,
      date,
      hoursWorked,
      rate,
      rateType,
      clientRating,
      clientNote,
      status,
    } = req.body;

    const earnings = rateType === "hourly" ? rate * (hoursWorked || 0) : rate;

    const result = await db.collection("gigs").updateOne(
      {
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(req.user._id),
      },
      {
        $set: {
          title,
          clientName,
          gigType,
          date: new Date(date),
          hoursWorked,
          rate,
          rateType,
          earnings,
          clientRating,
          clientNote,
          status,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json({ message: "Gig updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/gigs/:id — delete a gig
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("gigs").deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user._id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/gigs/dashboard — earnings summary
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const db = getDB();

    const gigs = await db
      .collection("gigs")
      .find({ userId: new ObjectId(req.user._id) })
      .toArray();

    // Monthly totals
    const monthlyTotals = {};
    // Breakdown by gig type
    const byType = {};

    gigs.forEach((gig) => {
      const month = gig.date.toISOString().slice(0, 7); // e.g. 2024-11
      monthlyTotals[month] = (monthlyTotals[month] || 0) + gig.earnings;
      byType[gig.gigType] = (byType[gig.gigType] || 0) + gig.earnings;
    });

    res.json({
      monthlyTotals,
      byType,
      totalEarnings: gigs.reduce((sum, g) => sum + g.earnings, 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
