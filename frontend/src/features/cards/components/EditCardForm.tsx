import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCardSchema, type UpdateCardInput } from '../../../shared/utils/validation';
import { useUpdateCard } from '../../../hooks/useCards';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { Button } from '../../../shared/components/ui/Button';
import type { Card } from '../../../types';

interface EditCardFormProps {
  card: Card;
  boardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditCardForm({ card, boardId, onSuccess, onCancel }: EditCardFormProps) {
  const updateCardMutation = useUpdateCard(boardId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateCardInput>({
    resolver: zodResolver(updateCardSchema),
    defaultValues: {
      title: card.title,
      description: card.description,
    },
  });

  useEffect(() => {
    reset({
      title: card.title,
      description: card.description,
    });
  }, [card, reset]);

  const onSubmit = async (data: UpdateCardInput) => {
    try {
      await updateCardMutation.mutateAsync({ id: card.id, data });
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
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
          Salvar
        </Button>
      </div>
    </form>
  );
}
