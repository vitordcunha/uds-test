import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useBoard } from "../../../hooks/useBoards";
import { useMoveCard, useDeleteCard } from "../../../hooks/useCards";
import { Column } from "../../columns/components/Column";
import { Card as CardComponent } from "../../cards/components/Card";
import { CreateCardForm } from "../../cards/components/CreateCardForm";
import { EditCardForm } from "../../cards/components/EditCardForm";
import { CreateColumnForm } from "../../columns/components/CreateColumnForm";
import { Modal } from "../../../shared/components/ui/Modal";
import { ConfirmDialog } from "../../../shared/components/feedback/ConfirmDialog";
import { Button } from "../../../shared/components/ui/Button";
import type { Card } from "../../../types";

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const { data: board, isLoading, error } = useBoard(boardId);
  const moveCardMutation = useMoveCard(boardId);
  const deleteCardMutation = useDeleteCard(boardId);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [addingCardToColumn, setAddingCardToColumn] = useState<string | null>(
    null
  );
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

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

    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

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
    setAddingCardToColumn(columnId);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
  };

  const handleCloseCreateModal = () => {
    setAddingCardToColumn(null);
  };

  const handleCloseEditModal = () => {
    setEditingCard(null);
  };

  const handleCreateColumn = () => {
    setIsCreatingColumn(true);
  };

  const handleCloseCreateColumnModal = () => {
    setIsCreatingColumn(false);
  };

  const handleDeleteCard = (cardId: string) => {
    setCardToDelete(cardId);
  };

  const handleConfirmDeleteCard = () => {
    if (cardToDelete) {
      deleteCardMutation.mutate(cardToDelete, {
        onSuccess: () => {
          setCardToDelete(null);
        },
        onError: () => {
          setCardToDelete(null);
        },
      });
    }
  };

  const handleCancelDeleteCard = () => {
    setCardToDelete(null);
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
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado"}
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{board.name}</h2>
          <p className="text-gray-600 mt-1">
            {board.columns?.length || 0}{" "}
            {board.columns?.length === 1 ? "coluna" : "colunas"}
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateColumn}>
          + Nova Coluna
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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
              <Button
                variant="primary"
                onClick={handleCreateColumn}
                className="mt-4"
              >
                Criar Coluna
              </Button>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-90">
              <CardComponent
                card={activeCard}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <Modal
        isOpen={addingCardToColumn !== null}
        onClose={handleCloseCreateModal}
        title="Criar Novo Card"
      >
        {addingCardToColumn && (
          <CreateCardForm
            columnId={addingCardToColumn}
            boardId={boardId}
            onSuccess={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={editingCard !== null}
        onClose={handleCloseEditModal}
        title="Editar Card"
      >
        {editingCard && (
          <EditCardForm
            card={editingCard}
            boardId={boardId}
            onSuccess={handleCloseEditModal}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCreatingColumn}
        onClose={handleCloseCreateColumnModal}
        title="Criar Nova Coluna"
      >
        <CreateColumnForm
          boardId={boardId}
          onSuccess={handleCloseCreateColumnModal}
          onCancel={handleCloseCreateColumnModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={cardToDelete !== null}
        onClose={handleCancelDeleteCard}
        onConfirm={handleConfirmDeleteCard}
        title="Excluir Card"
        message="Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        loading={deleteCardMutation.isPending}
      />
    </div>
  );
}
