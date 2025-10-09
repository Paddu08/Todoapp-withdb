// lib/data/tasks.ts

import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { eq } from "drizzle-orm"; // Assuming you need Drizzle helpers
import { getCurrUser } from "./getCurrUser";

export async function getTasksByAuthId(authId: string) {
 

  const user = await getCurrUser(authId)

  if (!user) {
    return []; 
  }

  const todos = await db.select()
    .from(taskTable)
    .where(eq(taskTable.userId, user.id));
    
  return todos;
}