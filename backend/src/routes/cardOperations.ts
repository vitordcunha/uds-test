import { Router } from "express";

const router = Router();

// PUT /api/cards/:id - Update a card
router.put("/:id", (req, res) => {
  res.json({ message: "Card updated successfully" });
});

// DELETE /api/cards/:id - Delete a card
router.delete("/:id", (req, res) => {
  res.status(204).send();
});

export default router;
