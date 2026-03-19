import express from "express";
import { getDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Health status logic
function getHealthStatus(goal) {
  const now = new Date();
  const [year, month] = goal.month.split("-").map(Number);
  const monthEnd = new Date(year, month, 0); // last day of month

  const received = goal.payouts
    .filter((p) => p.status === "received")
    .reduce((sum, p) => sum + p.amount, 0);

  const ratio = received / goal.targetAmount;

  if (now > monthEnd && ratio < 1) return "missed";
  if (ratio >= 0.8) return "on track";
  if (ratio >= 0.5) return "at risk";
  return "missed";
}

// GET /api/goals
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { month, health } = req.query;

    let goals = await db
      .collection("goals")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Attach health status
    goals = goals.map((g) => ({ ...g, health: getHealthStatus(g) }));

    // Filter by month
    if (month) goals = goals.filter((g) => g.month === month);

    // Filter by health
    if (health) goals = goals.filter((g) => g.health === health);

    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/goals
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { label, targetAmount, month } = req.body;

    if (!label || !targetAmount || !month) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const goal = {
      label,
      targetAmount: parseFloat(targetAmount),
      month,
      payouts: [],
      createdAt: new Date(),
    };

    const result = await db.collection("goals").insertOne(goal);
    res.status(201).json({ message: "Goal created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/goals/:id
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { label, targetAmount, month } = req.body;

    const result = await db.collection("goals").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          label,
          targetAmount: parseFloat(targetAmount),
          month,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/goals/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("goals")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/goals/:id/payouts
router.post("/:id/payouts", async (req, res) => {
  try {
    const db = getDB();
    const { source, amount, date, status } = req.body;

    if (!source || !amount || !date || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payout = {
      _id: new ObjectId(),
      source,
      amount: parseFloat(amount),
      date: new Date(date),
      status,
    };

    const result = await db
      .collection("goals")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $push: { payouts: payout } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(201).json({ message: "Payout added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/goals/:id/payouts/:payoutId
router.put("/:id/payouts/:payoutId", async (req, res) => {
  try {
    const db = getDB();
    const { source, amount, date, status } = req.body;

    const result = await db.collection("goals").updateOne(
      {
        _id: new ObjectId(req.params.id),
        "payouts._id": new ObjectId(req.params.payoutId),
      },
      {
        $set: {
          "payouts.$.source": source,
          "payouts.$.amount": parseFloat(amount),
          "payouts.$.date": new Date(date),
          "payouts.$.status": status,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Payout not found" });
    }

    res.json({ message: "Payout updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/goals/:id/payouts/:payoutId
router.delete("/:id/payouts/:payoutId", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("goals").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $pull: {
          payouts: { _id: new ObjectId(req.params.payoutId) },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Payout deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
