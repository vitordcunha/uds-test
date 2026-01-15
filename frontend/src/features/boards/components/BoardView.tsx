import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useBoard } from '../../../hooks/useBoards';
import { useMoveCard } from '../../../hooks/useCards';
import { Column } from '../../columns/components/Column';
import type { Card } from '../../../types';

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const { data: board, isLoading, error } = useBoard(boardId);
  const moveCardMutation = useMoveCard(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimento antes de iniciar drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board?.columns
      ?.flatMap((col) => col.cards || [])
      .find((c) => c?.id === active.id);

    // Card será usado no DragOverlay na próxima fase
    if (card) {
      // TODO: Implementar DragOverlay na próxima fase
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = active.id as string;
    const newColumnId = over.id as string;

    // Encontrar a coluna atual do card
    const currentColumn = board?.columns?.find((col) =>
      col.cards?.some((card) => card.id === cardId)
    );

    if (!currentColumn) return;

    // Se moveu para coluna diferente
    if (currentColumn.id !== newColumnId) {
      moveCardMutation.mutate({
        id: cardId,
        data: { newColumnId },
      });
    }
  };

  const handleAddCard = (columnId: string) => {
    // TODO: Implementar modal para criar card
    console.log('Add card to column:', columnId);
  };

  const handleEditCard = (card: Card) => {
    // TODO: Implementar modal para editar card
    console.log('Edit card:', card);
  };

  const handleDeleteCard = (cardId: string) => {
    // TODO: Implementar confirmação e exclusão
    console.log('Delete card:', cardId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando quadro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-semibold">Erro ao carregar quadro</p>
          <p className="text-gray-600 mt-2">
            {error instanceof Error ? error.message : 'Ocorreu um erro inesperado'}
          </p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Quadro não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{board.name}</h2>
        <p className="text-gray-600 mt-1">
          {board.columns?.length || 0} {board.columns?.length === 1 ? 'coluna' : 'colunas'}
        </p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns?.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}

          {board.columns?.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 w-full">
              <p className="text-gray-600">Nenhuma coluna criada ainda</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Criar Coluna
              </button>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}
