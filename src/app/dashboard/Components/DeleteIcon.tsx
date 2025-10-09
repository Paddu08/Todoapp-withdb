'use client';

import { deleteTask } from '@/lib/actions/deleteTask';
import { deleteTaskAction } from '@/lib/actions/deleteTaskAction';
import { DeleteIcon } from 'lucide-react';
interface DeleteButtonProps {
  taskId: number;
}

export default function DeleteButton({ taskId }: DeleteButtonProps) {

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    await deleteTaskAction(taskId); // call server action
  };

  return (
    <button onClick={handleDelete} className="p-1 hover:text-red-600 transition">
      <DeleteIcon size={20} />
    </button>
  );
}
