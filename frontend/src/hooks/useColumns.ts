import { useMutation, useQueryClient } from '@tanstack/react-query';
import { columnsApi } from '../services/api';
import { boardKeys } from './useBoards';
import type { CreateColumnRequest } from '../types';

// Hook para criar uma nova coluna
export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnRequest) => columnsApi.create(boardId, data),
    onSuccess: () => {
      // Invalida o quadro específico para refetch com a nova coluna
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
      // Também invalida a lista de quadros caso seja necessário
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
    },
  });
}
