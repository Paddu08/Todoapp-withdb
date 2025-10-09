import { db } from "@/db";
import { taskTable, sharedTaskTable, usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrUser } from "./getCurrUser";

export async function getTasksByAuthId(authId: string) {
  const user = await getCurrUser(authId);
  if (!user) return [];

  const todos = await db
    .select({
      taskId: taskTable.task_id,
      title: taskTable.title,
      description: taskTable.description,
      isCompleted: taskTable.isCompleted,
      sharedWith: sql<string[]>`
        ARRAY(
          SELECT id
          FROM ${sharedTaskTable}
          INNER JOIN ${usersTable} ON ${sharedTaskTable.userId} = ${usersTable.id}
          WHERE ${sharedTaskTable.taskId} = ${taskTable.task_id}
        )
      `,
    })
    .from(taskTable)
    .where(eq(taskTable.userId, user.id));

  return todos;
}
