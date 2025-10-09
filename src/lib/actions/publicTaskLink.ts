"use server";

import { db } from "@/db";
import { publicTaskLinkTable, taskTable } from "@/db/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";


export async function createPublicTaskLink(taskId: number) {
  // Fetch task to get owner
  const task = await db.select()
    .from(taskTable)
    .where(eq(taskTable.task_id, taskId))
    .limit(1);

  if (!task[0]) throw new Error("Task not found");

  const userId = task[0].userId;

  // Generate unique token
  const token = randomBytes(8).toString("hex");

  // Set 1-hour expiry
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  // Insert public link
  const inserted = await db.insert(publicTaskLinkTable).values({
    taskId,
    userId,
    token,
    createdAt: now,
    expiresAt,
  }).returning();

  return {
    token: inserted[0].token,
    expiresAt: inserted[0].expiresAt,
  
  };
}
