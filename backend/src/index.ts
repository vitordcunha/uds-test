import express from "express";
import cors from "cors";
import boardsRouter from "./routes/boards";
import columnsRouter from "./routes/columns";
import cardsRouter from "./routes/cards";
import cardOperationsRouter from "./routes/cardOperations";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/boards", boardsRouter);
app.use("/api/boards/:boardId/columns", columnsRouter);
app.use("/api/columns/:columnId/cards", cardsRouter);
app.use("/api/cards", cardOperationsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
