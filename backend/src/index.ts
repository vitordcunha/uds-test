import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Repositories
import {
  BoardRepository,
  ColumnRepository,
  CardRepository,
} from "./infrastructure/database/repositories";

// Use Cases
import { MoveCardBetweenColumns } from "./application/use-cases/card/MoveCardBetweenColumns";

// Controllers
import { CardController } from "./presentation/http/controllers/CardController";

// Middlewares
import { errorHandler } from "./presentation/http/middlewares/errorHandler";

// Routes
import boardsRouter from "./routes/boards";
import columnsRouter from "./routes/columns";
import cardsRouter from "./routes/cards";
import cardOperationsRouter from "./routes/cardOperations";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection
const boardRepo = new BoardRepository();
const columnRepo = new ColumnRepository();
const cardRepo = new CardRepository();

const moveCardUseCase = new MoveCardBetweenColumns(
  cardRepo,
  columnRepo,
  boardRepo
);

const cardController = new CardController(moveCardUseCase);

// Routes
app.use("/api/boards", boardsRouter);
app.use("/api/boards/:boardId/columns", columnsRouter);
app.use("/api/columns/:columnId/cards", cardsRouter);
app.use("/api/cards", cardOperationsRouter);

// New route with controller
app.patch("/api/cards/:id/move", (req, res, next) =>
  cardController.moveCard(req, res, next)
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error Handler (must be the last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
