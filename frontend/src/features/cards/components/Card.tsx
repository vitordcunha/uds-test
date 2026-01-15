import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../../../types';
import { cn } from '../../../shared/utils/cn';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

export function Card({ card, onEdit, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm',
        'hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 flex-1">{card.title}</h4>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Editar card"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Excluir card"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {card.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{card.description}</p>
      )}
    </div>
  );
}
