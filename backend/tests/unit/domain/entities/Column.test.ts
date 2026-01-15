import { Column } from '../../../../src/domain/entities/Column';
import { DomainException } from '../../../../src/domain/exceptions/DomainException';

describe('Column Entity', () => {
  describe('Creation', () => {
    it('should create a valid column', () => {
      const column = new Column('Test Column', 'board-1', 'column-1', 0);
      
      expect(column.name).toBe('Test Column');
      expect(column.boardId).toBe('board-1');
      expect(column.id).toBe('column-1');
      expect(column.order).toBe(0);
    });

    it('should throw error when name is empty', () => {
      expect(() => new Column('', 'board-1')).toThrow(DomainException);
      expect(() => new Column('', 'board-1')).toThrow('Column name is required');
    });

    it('should throw error when name exceeds 255 characters', () => {
      const longName = 'a'.repeat(256);
      expect(() => new Column(longName, 'board-1')).toThrow(DomainException);
    });
  });

  describe('addCard', () => {
    it('should add a card to the column', () => {
      const column = new Column('Test Column', 'board-1');
      column.addCard('card-1');
      
      expect(column.hasCard('card-1')).toBe(true);
    });

    it('should not add duplicate cards', () => {
      const column = new Column('Test Column', 'board-1');
      column.addCard('card-1');
      column.addCard('card-1');
      
      expect(column.hasCard('card-1')).toBe(true);
    });
  });

  describe('hasCard', () => {
    it('should return false when card does not exist', () => {
      const column = new Column('Test Column', 'board-1');
      
      expect(column.hasCard('card-1')).toBe(false);
    });
  });
});
