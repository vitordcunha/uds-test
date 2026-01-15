import { Card } from '../../../../src/domain/entities/Card';
import { Board } from '../../../../src/domain/entities/Board';
import { DomainException } from '../../../../src/domain/exceptions/DomainException';

describe('Card Entity', () => {
  describe('Creation', () => {
    it('should create a valid card', () => {
      const card = new Card('Test Card', 'column-1', 'Description');
      
      expect(card.title).toBe('Test Card');
      expect(card.description).toBe('Description');
      expect(card.columnId).toBe('column-1');
    });

    it('should throw error when title is empty', () => {
      expect(() => new Card('', 'column-1')).toThrow(DomainException);
      expect(() => new Card('', 'column-1')).toThrow('Card title is required');
    });

    it('should throw error when title exceeds 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      expect(() => new Card(longTitle, 'column-1')).toThrow(DomainException);
    });
  });

  describe('moveToColumn - CRITICAL BUSINESS RULE', () => {
    it('should move card to another column in the same board', () => {
      const board = new Board('Test Board', 'board-1');
      board.addColumn('column-1');
      board.addColumn('column-2');

      const card = new Card('Test Card', 'column-1');
      
      card.moveToColumn('column-2', board);
      
      expect(card.columnId).toBe('column-2');
    });

    it('should throw error when moving to column from different board', () => {
      const board = new Board('Test Board', 'board-1');
      board.addColumn('column-1');
      // column-2 NÃO pertence a este board

      const card = new Card('Test Card', 'column-1');
      
      expect(() => card.moveToColumn('column-2', board)).toThrow(DomainException);
      expect(() => card.moveToColumn('column-2', board)).toThrow(
        'Card can only be moved between columns of the same board'
      );
    });
  });

  describe('updateTitle', () => {
    it('should update card title', () => {
      const card = new Card('Old Title', 'column-1');
      
      card.updateTitle('New Title');
      
      expect(card.title).toBe('New Title');
    });

    it('should throw error when updating to empty title', () => {
      const card = new Card('Test Card', 'column-1');
      
      expect(() => card.updateTitle('')).toThrow(DomainException);
    });
  });
});
