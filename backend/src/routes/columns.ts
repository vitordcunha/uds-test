import { Router } from "express";

const router = Router({ mergeParams: true });

// POST /api/boards/:boardId/columns - Create a new column
router.post("/", (req, res) => {
  res.status(201).json({ message: "Column created successfully" });
});

export default router;
