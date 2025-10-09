"use server";

import { db } from "@/db";
import { publicTaskLinkTable, taskTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrUser } from "./getCurrUser";


export async function getPublicLinksByUserId(auth_id: string) {
      const user = await getCurrUser(auth_id)
    
  const links = await db
    .select({
      token: publicTaskLinkTable.token,
      taskId: publicTaskLinkTable.taskId,
      taskTitle: taskTable.title,
      createdAt: publicTaskLinkTable.createdAt,
      expiresAt: publicTaskLinkTable.expiresAt,
    })
    .from(publicTaskLinkTable)
    .leftJoin(taskTable, eq(publicTaskLinkTable.taskId, taskTable.task_id))
    .where(eq(publicTaskLinkTable.userId, user.id))
    .orderBy(publicTaskLinkTable.createdAt);

  return links;
}
