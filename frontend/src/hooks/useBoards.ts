import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '../services/api';
import type { CreateBoardRequest } from '../types';

// Query keys
export const boardKeys = {
  all: ['boards'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (id: string) => [...boardKeys.details(), id] as const,
};

// Hook para listar todos os quadros
export function useBoards() {
  return useQuery({
    queryKey: boardKeys.lists(),
    queryFn: () => boardsApi.getAll(),
  });
}

// Hook para obter um quadro específico
export function useBoard(id: string | null) {
  return useQuery({
    queryKey: boardKeys.detail(id!),
    queryFn: () => boardsApi.getById(id!),
    enabled: !!id,
  });
}

// Hook para criar um novo quadro
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardRequest) => boardsApi.create(data),
    onSuccess: () => {
      // Invalida a lista de quadros para refetch
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
    },
  });
}
