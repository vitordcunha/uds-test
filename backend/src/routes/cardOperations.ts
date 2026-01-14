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

// PATCH /api/cards/:id/move - Move a card to a different column
router.patch("/:id/move", (req, res) => {
  res.json({ message: "Card moved successfully" });
});

export default router;
