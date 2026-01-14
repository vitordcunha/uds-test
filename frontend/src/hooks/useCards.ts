import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../services/api';
import { boardKeys } from './useBoards';
import type { CreateCardRequest, UpdateCardRequest, MoveCardRequest } from '../types';

// Hook para criar um novo cartão
export function useCreateCard(columnId: string, boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsApi.create(columnId, data),
    onSuccess: () => {
      // Invalida o quadro para refetch com o novo cartão
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
    onSuccess: () => {
      // Invalida o quadro para refetch com o cartão atualizado
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

// Hook para excluir um cartão
export function useDeleteCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      // Invalida o quadro para refetch sem o cartão excluído
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
    onSuccess: () => {
      // Invalida o quadro para refetch com o cartão na nova posição
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}
