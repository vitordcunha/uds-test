import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../services/api';
import { boardKeys } from './useBoards';
import type { Board, Card, CreateCardRequest, UpdateCardRequest, MoveCardRequest } from '../types';

// Hook para criar um novo cartão
export function useCreateCard(columnId: string, boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsApi.create(columnId, data),
    
    // Optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });

      const previousBoard = queryClient.getQueryData<Board>(boardKeys.detail(boardId));

      // Criar card temporário com ID temporário
      const tempCard: Card = {
        id: `temp-${Date.now()}`,
        title: data.title,
        description: data.description,
        columnId,
      };

      queryClient.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;

        const newColumns = old.columns?.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...(column.cards || []), tempCard],
            };
          }
          return column;
        });

        return { ...old, columns: newColumns };
      });

      return { previousBoard };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

// Hook para atualizar um cartão
export function useUpdateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) =>
      cardsApi.update(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });

      const previousBoard = queryClient.getQueryData<Board>(boardKeys.detail(boardId));

      queryClient.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;

        const newColumns = old.columns?.map((column) => {
          const cards = column.cards?.map((card) => {
            if (card.id === id) {
              return {
                ...card,
                ...data,
              };
            }
            return card;
          });

          return { ...column, cards };
        });

        return { ...old, columns: newColumns };
      });

      return { previousBoard };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

// Hook para excluir um cartão
export function useDeleteCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });

      const previousBoard = queryClient.getQueryData<Board>(boardKeys.detail(boardId));

      queryClient.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;

        const newColumns = old.columns?.map((column) => {
          const cards = column.cards?.filter((card) => card.id !== id) || [];
          return { ...column, cards };
        });

        return { ...old, columns: newColumns };
      });

      return { previousBoard };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

// Hook para mover um cartão entre colunas
export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveCardRequest }) =>
      cardsApi.move(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });

      // Snapshot do estado anterior
      const previousBoard = queryClient.getQueryData<Board>(boardKeys.detail(boardId));

      // Atualizar cache otimisticamente
      queryClient.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;

        const newColumns = old.columns?.map((column) => {
          // Remover card da coluna atual
          const cards = column.cards?.filter((card) => card.id !== id) || [];

          // Adicionar card na nova coluna
          if (column.id === data.newColumnId) {
            const movedCard = old.columns
              ?.flatMap((col) => col.cards || [])
              .find((card) => card.id === id);

            if (movedCard) {
              return {
                ...column,
                cards: [...cards, { ...movedCard, columnId: data.newColumnId }],
              };
            }
          }

          return { ...column, cards };
        });

        return { ...old, columns: newColumns };
      });

      return { previousBoard };
    },

    // Reverter em caso de erro
    onError: (_err, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    // Refetch após sucesso
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}
