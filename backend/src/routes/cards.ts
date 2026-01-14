import { Router } from "express";

const router = Router({ mergeParams: true });

// POST /api/columns/:columnId/cards - Create a new card
router.post("/", (req, res) => {
  res.status(201).json({ message: "Card created successfully" });
});

export default router;
