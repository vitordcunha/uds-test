import { useState } from "react";
import { useLocation } from "wouter";
import { useBoards } from "../hooks";
import type { Board } from "../types";
import { Modal } from "../shared/components/ui/Modal";
import { CreateBoardForm } from "../features/boards/components/CreateBoardForm";

function BoardList() {
  const [, setLocation] = useLocation();
  const { data: boards, isLoading, error } = useBoards();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateBoard = () => {
    setIsModalOpen(true);
  };

  const handleBoardClick = (board: Board) => {
    setLocation(`/boards/${board.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando quadros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-semibold">Erro ao carregar quadros</p>
          <p className="text-gray-600 mt-2">
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus Quadros</h2>
          <p className="text-gray-600 mt-1">
            {boards?.length === 0
              ? "Nenhum quadro criado ainda"
              : `${boards?.length || 0} ${
                  boards?.length === 1 ? "quadro" : "quadros"
                }`}
          </p>
        </div>
        <button
          onClick={handleCreateBoard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Novo Quadro
        </button>
      </div>

      {boards && boards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Nenhum quadro encontrado
          </h3>
          <p className="mt-2 text-gray-600">
            Comece criando seu primeiro quadro!
          </p>
          <button
            onClick={handleCreateBoard}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Criar Quadro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards?.map((board) => (
            <div
              key={board.id}
              onClick={() => handleBoardClick(board)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {board.name}
                </h3>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Novo Quadro"
        size="md"
      >
        <CreateBoardForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default BoardList;
