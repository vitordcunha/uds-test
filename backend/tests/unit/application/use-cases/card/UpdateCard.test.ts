import { UpdateCard } from "../../../../../src/application/use-cases/card/UpdateCard";
import { Card } from "../../../../../src/domain/entities/Card";
import { ICardRepository } from "../../../../../src/application/interfaces/repositories/ICardRepository";
import { NotFoundError } from "../../../../../src/shared/errors/NotFoundError";

// Mock
const mockCardRepo: jest.Mocked<ICardRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("UpdateCard Use Case", () => {
  let useCase: UpdateCard;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateCard(mockCardRepo);
  });

  it("should update card title successfully", async () => {
    // Arrange
    const cardId = "card-1";
    const card = new Card("Old Title", "column-1", undefined, cardId);
    const updatedCard = new Card("New Title", "column-1", undefined, cardId);

    mockCardRepo.findById.mockResolvedValue(card);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    // Act
    const result = await useCase.execute(cardId, {
      title: "New Title",
    });

    // Assert
    expect(result.title).toBe("New Title");
    expect(mockCardRepo.findById).toHaveBeenCalledWith(cardId);
    expect(mockCardRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should update card description successfully", async () => {
    // Arrange
    const cardId = "card-1";
    const card = new Card("Test Card", "column-1", "Old Description", cardId);
    const updatedCard = new Card("Test Card", "column-1", "New Description", cardId);

    mockCardRepo.findById.mockResolvedValue(card);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    // Act
    const result = await useCase.execute(cardId, {
      description: "New Description",
    });

    // Assert
    expect(result.description).toBe("New Description");
    expect(mockCardRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should update both title and description successfully", async () => {
    // Arrange
    const cardId = "card-1";
    const card = new Card("Old Title", "column-1", "Old Description", cardId);
    const updatedCard = new Card("New Title", "column-1", "New Description", cardId);

    mockCardRepo.findById.mockResolvedValue(card);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    // Act
    const result = await useCase.execute(cardId, {
      title: "New Title",
      description: "New Description",
    });

    // Assert
    expect(result.title).toBe("New Title");
    expect(result.description).toBe("New Description");
    expect(mockCardRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should not update fields that are undefined", async () => {
    // Arrange
    const cardId = "card-1";
    const card = new Card("Original Title", "column-1", "Original Description", cardId);
    const updatedCard = new Card("Original Title", "column-1", "Original Description", cardId);

    mockCardRepo.findById.mockResolvedValue(card);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    // Act
    const result = await useCase.execute(cardId, {});

    // Assert
    expect(result.title).toBe("Original Title");
    expect(result.description).toBe("Original Description");
    expect(mockCardRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should throw NotFoundError when card does not exist", async () => {
    // Arrange
    const cardId = "invalid-id";
    mockCardRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(cardId, { title: "New Title" })
    ).rejects.toThrow(NotFoundError);
    await expect(
      useCase.execute(cardId, { title: "New Title" })
    ).rejects.toThrow(`Card with id ${cardId} not found`);
    expect(mockCardRepo.findById).toHaveBeenCalledWith(cardId);
    expect(mockCardRepo.update).not.toHaveBeenCalled();
  });
});
