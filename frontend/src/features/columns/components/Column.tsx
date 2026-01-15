import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Card as CardType } from '../../../types';
import { Card } from '../../cards/components/Card';
import { cn } from '../../../shared/utils/cn';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export function Column({ column, onAddCard, onEditCard, onDeleteCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const cardIds = column.cards?.map((card) => card.id) || [];

  return (
    <div className="shrink-0 w-80">
      <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {column.name}
            <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {column.cards?.length || 0}
            </span>
          </h3>
        </div>

        {/* Cards List */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition-colors',
            isOver && 'bg-blue-50 border-2 border-blue-300 border-dashed'
          )}
        >
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {column.cards?.map((card) => (
              <Card
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))}
          </SortableContext>

          {column.cards?.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Nenhum card nesta coluna
            </div>
          )}
        </div>

        {/* Add Card Button */}
        <button
          onClick={() => onAddCard(column.id)}
          className="mt-4 w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar Card
        </button>
      </div>
    </div>
  );
}
