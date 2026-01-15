import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Repositories
import {
  BoardRepository,
  ColumnRepository,
  CardRepository,
} from "./infrastructure/database/repositories";

// Use Cases - Board
import {
  CreateBoard,
  GetAllBoards,
  GetBoardById,
} from "./application/use-cases/board";

// Use Cases - Column
import { CreateColumn } from "./application/use-cases/column";

// Use Cases - Card
import {
  CreateCard,
  UpdateCard,
  DeleteCard,
  MoveCardBetweenColumns,
} from "./application/use-cases/card";

// Controllers
import {
  BoardController,
  ColumnController,
  CardController,
} from "./presentation/http/controllers";

// Routes
import {
  createBoardsRouter,
  createColumnsRouter,
  createCardsRouter,
  createCardOperationsRouter,
} from "./routes";

// Middlewares
import { errorHandler } from "./presentation/http/middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection - Repositories
const boardRepo = new BoardRepository();
const columnRepo = new ColumnRepository();
const cardRepo = new CardRepository();

// Dependency Injection - Use Cases - Board
const createBoardUseCase = new CreateBoard(boardRepo);
const getAllBoardsUseCase = new GetAllBoards(boardRepo);
const getBoardByIdUseCase = new GetBoardById(boardRepo);

// Dependency Injection - Use Cases - Column
const createColumnUseCase = new CreateColumn(columnRepo, boardRepo);

// Dependency Injection - Use Cases - Card
const createCardUseCase = new CreateCard(cardRepo, columnRepo);
const updateCardUseCase = new UpdateCard(cardRepo);
const deleteCardUseCase = new DeleteCard(cardRepo);
const moveCardUseCase = new MoveCardBetweenColumns(
  cardRepo,
  columnRepo,
  boardRepo
);

// Dependency Injection - Controllers
const boardController = new BoardController(
  createBoardUseCase,
  getAllBoardsUseCase,
  getBoardByIdUseCase,
  columnRepo,
  cardRepo
);
const columnController = new ColumnController(createColumnUseCase);
const cardController = new CardController(
  moveCardUseCase,
  createCardUseCase,
  updateCardUseCase,
  deleteCardUseCase
);

// Routes
app.use("/api/boards", createBoardsRouter(boardController));
app.use("/api/boards/:boardId/columns", createColumnsRouter(columnController));
app.use("/api/columns/:columnId/cards", createCardsRouter(cardController));
app.use("/api/cards", createCardOperationsRouter(cardController));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error Handler (must be the last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
