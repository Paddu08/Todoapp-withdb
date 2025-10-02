// lib/data/tasks.ts

import { db } from "@/db";
import { taskTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm"; // Assuming you need Drizzle helpers

// Define the function to fetch tasks based on an external auth_id
export async function getTasksByAuthId(authId: string) {
  // 1. Find the user's internal ID
  const users = await db.select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.auth_id, authId))
    .limit(1);

  const user = users[0];

  if (!user) {
    // Handle the case where the user doesn't exist
    return []; 
  }

  // 2. Fetch todos using the internal user ID
  const todos = await db.select()
    .from(taskTable)
    .where(eq(taskTable.userId, user.id));
    
  return todos;
}