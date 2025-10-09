"use server";

import { db } from "@/db";
import { sharedTaskTable } from "@/db/schema";

export async function shareTaskAction(taskId: number, userId: number) {
  await db.insert(sharedTaskTable).values({
    taskId: taskId,
    userId: userId,
    access: "read",
    createdAt: new Date(),
  });

  return true;
}
