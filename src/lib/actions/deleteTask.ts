import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteTask(taskId: number) {
  await db
    .delete(taskTable)
    .where(eq(taskTable.task_id, taskId))
    .execute();
}
