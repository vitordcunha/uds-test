import { GetAllBoards } from "../../../../../src/application/use-cases/board/GetAllBoards";
import { Board } from "../../../../../src/domain/entities/Board";
import { IBoardRepository } from "../../../../../src/application/interfaces/repositories/IBoardRepository";

// Mock
const mockBoardRepo: jest.Mocked<IBoardRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
};

describe("GetAllBoards Use Case", () => {
  let useCase: GetAllBoards;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetAllBoards(mockBoardRepo);
  });

  it("should return all boards successfully", async () => {
    // Arrange
    const boards = [
      new Board("Board 1", "board-1"),
      new Board("Board 2", "board-2"),
      new Board("Board 3", "board-3"),
    ];
    mockBoardRepo.findAll.mockResolvedValue(boards);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual(boards);
    expect(mockBoardRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no boards exist", async () => {
    // Arrange
    mockBoardRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(mockBoardRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
