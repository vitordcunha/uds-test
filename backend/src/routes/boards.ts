import { Router } from "express";

const router = Router();

// GET /api/boards - Get all boards
router.get("/", (req, res) => {
  res.json([{ id: "1", name: "Board 1", columns: [] }]);
});

// GET /api/boards/:id - Get board by ID
router.get("/:id", (req, res) => {
  res.json({ id: "1", name: "Board 1", columns: [] });
});

// POST /api/boards - Create a new board
router.post("/", (req, res) => {
  res.status(201).json({ message: "Board created successfully" });
});

export default router;
