import { CreateCard } from "../../../../../src/application/use-cases/card/CreateCard";
import { Card } from "../../../../../src/domain/entities/Card";
import { Column } from "../../../../../src/domain/entities/Column";
import { ICardRepository } from "../../../../../src/application/interfaces/repositories/ICardRepository";
import { IColumnRepository } from "../../../../../src/application/interfaces/repositories/IColumnRepository";
import { NotFoundError } from "../../../../../src/shared/errors/NotFoundError";

// Mocks
const mockCardRepo: jest.Mocked<ICardRepository> = {
  findById: jest.fn(),
  findByColumnId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockColumnRepo: jest.Mocked<IColumnRepository> = {
  findById: jest.fn(),
  findByBoardId: jest.fn(),
  create: jest.fn(),
};

describe("CreateCard Use Case", () => {
  let useCase: CreateCard;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateCard(mockCardRepo, mockColumnRepo);
  });

  it("should create a new card successfully", async () => {
    // Arrange
    const columnId = "column-1";
    const cardTitle = "Test Card";
    const column = new Column("Test Column", "board-1", columnId);
    const createdCard = new Card(cardTitle, columnId, undefined, "card-1");

    mockColumnRepo.findById.mockResolvedValue(column);
    mockCardRepo.create.mockResolvedValue(createdCard);

    // Act
    const result = await useCase.execute({
      title: cardTitle,
      columnId,
    });

    // Assert
    expect(result).toBeInstanceOf(Card);
    expect(result.title).toBe(cardTitle);
    expect(result.columnId).toBe(columnId);
    expect(mockColumnRepo.findById).toHaveBeenCalledWith(columnId);
    expect(mockCardRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should create card with description when provided", async () => {
    // Arrange
    const columnId = "column-1";
    const cardTitle = "Test Card";
    const cardDescription = "Test Description";
    const column = new Column("Test Column", "board-1", columnId);
    const createdCard = new Card(cardTitle, columnId, cardDescription, "card-1");

    mockColumnRepo.findById.mockResolvedValue(column);
    mockCardRepo.create.mockResolvedValue(createdCard);

    // Act
    const result = await useCase.execute({
      title: cardTitle,
      description: cardDescription,
      columnId,
    });

    // Assert
    expect(result.description).toBe(cardDescription);
    expect(mockCardRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundError when column does not exist", async () => {
    // Arrange
    const columnId = "invalid-column-id";
    mockColumnRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute({
        title: "Test Card",
        columnId,
      })
    ).rejects.toThrow(NotFoundError);
    await expect(
      useCase.execute({
        title: "Test Card",
        columnId,
      })
    ).rejects.toThrow(`Column with id ${columnId} not found`);
    expect(mockColumnRepo.findById).toHaveBeenCalledWith(columnId);
    expect(mockCardRepo.create).not.toHaveBeenCalled();
  });
});
