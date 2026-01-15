import { DeleteCard } from "../../../../../src/application/use-cases/card/DeleteCard";
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

describe("DeleteCard Use Case", () => {
  let useCase: DeleteCard;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteCard(mockCardRepo);
  });

  it("should delete card successfully", async () => {
    // Arrange
    const cardId = "card-1";
    const card = new Card("Test Card", "column-1", undefined, cardId);

    mockCardRepo.findById.mockResolvedValue(card);
    mockCardRepo.delete.mockResolvedValue();

    // Act
    await useCase.execute(cardId);

    // Assert
    expect(mockCardRepo.findById).toHaveBeenCalledWith(cardId);
    expect(mockCardRepo.delete).toHaveBeenCalledTimes(1);
    expect(mockCardRepo.delete).toHaveBeenCalledWith(cardId);
  });

  it("should throw NotFoundError when card does not exist", async () => {
    // Arrange
    const cardId = "invalid-id";
    mockCardRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(cardId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(cardId)).rejects.toThrow(
      `Card with id ${cardId} not found`
    );
    expect(mockCardRepo.findById).toHaveBeenCalledWith(cardId);
    expect(mockCardRepo.delete).not.toHaveBeenCalled();
  });
});
