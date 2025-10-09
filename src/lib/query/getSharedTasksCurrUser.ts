import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable, taskTable, sharedTaskTable } from "@/db/schema";
import { getCurrUser } from "./getCurrUser";

export async function getSharedTasksByAuthId(authId: string) {
const user=await getCurrUser(authId)

  // Step 2: Get all shared tasks for this user
  const sharedTasks = await db
    .select({
        shareId:sharedTaskTable.share_id,
      taskId: taskTable.task_id,
      title: taskTable.title,
      description: taskTable.description,
      isCompleted: taskTable.isCompleted,
      access: sharedTaskTable.access,
      sharedByUser: usersTable.name,
      sharedAt: sharedTaskTable.createdAt,
      userId:taskTable.userId
    })
    .from(sharedTaskTable)
    .innerJoin(taskTable, eq(sharedTaskTable.taskId, taskTable.task_id))
    .innerJoin(usersTable, eq(taskTable.userId, usersTable.id)) // task owner
    .where(eq(sharedTaskTable.userId, user.id));

  return sharedTasks;
}
