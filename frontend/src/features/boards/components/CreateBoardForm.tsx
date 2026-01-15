import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBoardSchema,
  type CreateBoardInput,
} from "../../../shared/utils/validation";
import { useCreateBoard } from "../../../hooks";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";

interface CreateBoardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateBoardForm({ onSuccess, onCancel }: CreateBoardFormProps) {
  const createBoard = useCreateBoard();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
  });

  const onSubmit = async (data: CreateBoardInput) => {
    try {
      await createBoard.mutateAsync(data);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar quadro:", error);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      reset();
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome do Quadro *"
        {...register("name")}
        placeholder="Ex: Projeto Alpha"
        error={errors.name?.message}
        autoFocus
        disabled={isSubmitting}
      />

      {createBoard.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {createBoard.error instanceof Error
              ? createBoard.error.message
              : "Erro ao criar quadro. Tente novamente."}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Criar Quadro
        </Button>
      </div>
    </form>
  );
}
