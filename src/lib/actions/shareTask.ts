"use server";

import { db } from "@/db";
import { sharedTaskTable } from "@/db/schema";
import { eq, and } from "drizzle-orm"; // import 'and' helper

export async function shareTaskAction(taskId: number, userId: number) {
  // Check if the task is already shared with this user
  const existing = await db
    .select()
    .from(sharedTaskTable)
    .where(
      and(
        eq(sharedTaskTable.taskId, taskId),
        eq(sharedTaskTable.userId, userId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Already shared, do not allow duplicate
    return false;
  }

  // Insert new share
  await db.insert(sharedTaskTable).values({
    taskId,
    userId,
    access: "read",
    createdAt: new Date(),
  });

  return true;
}
