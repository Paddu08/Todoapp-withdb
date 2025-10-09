"use server";

import { deleteTask } from "@/lib/actions/deleteTask";
import { revalidatePath } from "next/cache";

export async function deleteTaskAction(taskId: number) {
  await deleteTask(taskId);
  revalidatePath("/dashboard"); // marks the page cache as stale
}
