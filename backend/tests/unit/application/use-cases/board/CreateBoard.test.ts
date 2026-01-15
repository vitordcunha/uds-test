import { CreateBoard } from "../../../../../src/application/use-cases/board/CreateBoard";
import { Board } from "../../../../../src/domain/entities/Board";
import { IBoardRepository } from "../../../../../src/application/interfaces/repositories/IBoardRepository";

// Mock
const mockBoardRepo: jest.Mocked<IBoardRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
};

describe("CreateBoard Use Case", () => {
  let useCase: CreateBoard;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateBoard(mockBoardRepo);
  });

  it("should create a new board successfully", async () => {
    // Arrange
    const boardName = "Test Board";
    const createdBoard = new Board(boardName, "board-1");
    mockBoardRepo.create.mockResolvedValue(createdBoard);

    // Act
    const result = await useCase.execute({ name: boardName });

    // Assert
    expect(result).toBeInstanceOf(Board);
    expect(result.name).toBe(boardName);
    expect(mockBoardRepo.create).toHaveBeenCalledTimes(1);
    expect(mockBoardRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: boardName,
      })
    );
  });

  it("should create board with valid name", async () => {
    // Arrange
    const boardName = "My New Board";
    const createdBoard = new Board(boardName, "board-1");
    mockBoardRepo.create.mockResolvedValue(createdBoard);

    // Act
    const result = await useCase.execute({ name: boardName });

    // Assert
    expect(result.name).toBe(boardName);
  });
});
