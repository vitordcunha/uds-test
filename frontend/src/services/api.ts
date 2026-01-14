import axios from 'axios';
import type {
  Board,
  Column,
  Card,
  CreateBoardRequest,
  CreateColumnRequest,
  CreateCardRequest,
  UpdateCardRequest,
  MoveCardRequest,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Boards API
export const boardsApi = {
  getAll: async (): Promise<Board[]> => {
    const response = await api.get<Board[]>('/boards');
    return response.data;
  },

  getById: async (id: string): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  create: async (data: CreateBoardRequest): Promise<Board> => {
    const response = await api.post<Board>('/boards', data);
    return response.data;
  },
};

// Columns API
export const columnsApi = {
  create: async (boardId: string, data: CreateColumnRequest): Promise<Column> => {
    const response = await api.post<Column>(`/boards/${boardId}/columns`, data);
    return response.data;
  },
};

// Cards API
export const cardsApi = {
  create: async (columnId: string, data: CreateCardRequest): Promise<Card> => {
    const response = await api.post<Card>(`/columns/${columnId}/cards`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCardRequest): Promise<Card> => {
    const response = await api.put<Card>(`/cards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cards/${id}`);
  },

  move: async (id: string, data: MoveCardRequest): Promise<Card> => {
    const response = await api.patch<Card>(`/cards/${id}/move`, data);
    return response.data;
  },
};

export default api;
