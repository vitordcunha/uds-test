// Domain entities types
export interface Board {
  id: string;
  name: string;
  columns?: Column[];
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  cards?: Card[];
  order?: number;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
}

// API request/response types
export interface CreateBoardRequest {
  name: string;
}

export interface CreateColumnRequest {
  name: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
}

export interface MoveCardRequest {
  newColumnId: string;
}
