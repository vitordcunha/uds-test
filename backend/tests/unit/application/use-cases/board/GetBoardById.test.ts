import { GetBoardById } from "../../../../../src/application/use-cases/board/GetBoardById";
import { Board } from "../../../../../src/domain/entities/Board";
import { IBoardRepository } from "../../../../../src/application/interfaces/repositories/IBoardRepository";
import { NotFoundError } from "../../../../../src/shared/errors/NotFoundError";

// Mock
const mockBoardRepo: jest.Mocked<IBoardRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
};

describe("GetBoardById Use Case", () => {
  let useCase: GetBoardById;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetBoardById(mockBoardRepo);
  });

  it("should return board when found", async () => {
    // Arrange
    const boardId = "board-1";
    const board = new Board("Test Board", boardId);
    mockBoardRepo.findById.mockResolvedValue(board);

    // Act
    const result = await useCase.execute(boardId);

    // Assert
    expect(result).toBeInstanceOf(Board);
    expect(result.id).toBe(boardId);
    expect(result.name).toBe("Test Board");
    expect(mockBoardRepo.findById).toHaveBeenCalledTimes(1);
    expect(mockBoardRepo.findById).toHaveBeenCalledWith(boardId);
  });

  it("should throw NotFoundError when board does not exist", async () => {
    // Arrange
    const boardId = "invalid-id";
    mockBoardRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(boardId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(boardId)).rejects.toThrow(
      `Board with id ${boardId} not found`
    );
    expect(mockBoardRepo.findById).toHaveBeenCalledWith(boardId);
  });
});
