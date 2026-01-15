import { useState, type FormEvent } from "react";
import { useCreateBoard } from "../hooks";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateBoardModal({ isOpen, onClose }: CreateBoardModalProps) {
  const [name, setName] = useState("");
  const createBoard = useCreateBoard();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createBoard.mutateAsync({ name: name.trim() });
      setName("");
      onClose();
    } catch (error) {
      // Error handling is done by React Query
      console.error("Error creating board:", error);
    }
  };

  const handleClose = () => {
    if (!createBoard.isPending) {
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Criar Novo Quadro
            </h2>
            <button
              onClick={handleClose}
              disabled={createBoard.isPending}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="board-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome do Quadro
              </label>
              <input
                id="board-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Projeto Alpha"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                disabled={createBoard.isPending}
                required
              />
            </div>

            {createBoard.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {createBoard.error instanceof Error
                    ? createBoard.error.message
                    : "Erro ao criar quadro. Tente novamente."}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={createBoard.isPending}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createBoard.isPending || !name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createBoard.isPending ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  "Criar Quadro"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBoardModal;
