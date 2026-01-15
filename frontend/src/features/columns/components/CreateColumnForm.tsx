import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createColumnSchema, type CreateColumnInput } from '../../../shared/utils/validation';
import { useCreateColumn } from '../../../hooks/useColumns';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

interface CreateColumnFormProps {
  boardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateColumnForm({
  boardId,
  onSuccess,
  onCancel,
}: CreateColumnFormProps) {
  const createColumnMutation = useCreateColumn(boardId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateColumnInput>({
    resolver: zodResolver(createColumnSchema),
  });

  const onSubmit = async (data: CreateColumnInput) => {
    try {
      await createColumnMutation.mutateAsync(data);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome da Coluna *"
        {...register('name')}
        placeholder="Ex: Em Progresso"
        error={errors.name?.message}
        autoFocus
      />

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
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
          Criar Coluna
        </Button>
      </div>
    </form>
  );
}
