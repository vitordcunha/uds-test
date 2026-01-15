import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCardSchema, type CreateCardInput } from '../../../shared/utils/validation';
import { useCreateCard } from '../../../hooks/useCards';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { Button } from '../../../shared/components/ui/Button';

interface CreateCardFormProps {
  columnId: string;
  boardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateCardForm({
  columnId,
  boardId,
  onSuccess,
  onCancel,
}: CreateCardFormProps) {
  const createCardMutation = useCreateCard(columnId, boardId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
  });

  const onSubmit = async (data: CreateCardInput) => {
    try {
      await createCardMutation.mutateAsync(data);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar card:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título *"
        {...register('title')}
        placeholder="Digite o título do card"
        error={errors.title?.message}
        autoFocus
      />

      <Textarea
        label="Descrição"
        {...register('description')}
        rows={3}
        placeholder="Digite a descrição (opcional)"
        error={errors.description?.message}
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
          Criar Card
        </Button>
      </div>
    </form>
  );
}
