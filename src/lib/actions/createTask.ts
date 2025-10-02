"use server"; // Ensure this is a server action

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache"; // Essential for cache update
import { eq } from 'drizzle-orm'; // Added for database querying

// --- Assume these imports are configured for your project ---
import { db } from "@/db"; 
import { taskTable, usersTable } from "@/db/schema"; // Corrected to usersTable
// -----------------------------------------------------------

/**
 * Creates a new task in the database.
 *
 * @param title The title of the new task.
 * @param description The optional description of the task.
 */
export async function createTask(title: string, description?: string) {
  // 1. Fetch Clerk user details securely on the server
  const clerkUser = await currentUser();
  const clerkAuthId = clerkUser?.id; // This is the Clerk ID (authId)

  // SECURITY CHECK: Reject the request if the user is not authenticated.
  if (!clerkAuthId) {
    return { success: false, error: "Authentication required to create a task." };
  }
  
  // Input validation
  if (!title || title.trim() === "") {
    return { success: false, error: "Task title cannot be empty." };
  }

  try {
    // 2. LOOKUP: Find the internal foreign key ID from the usersTable
    const [internalUser] = await db
      .select({ id: usersTable.id }) // Select the internal ID column
      .from(usersTable)
      .where(eq(usersTable.auth_id, clerkAuthId)) // Match using the Clerk ID
      .limit(1);

    if (!internalUser) {
        // User is authenticated via Clerk but doesn't exist in our local usersTable.
        return { success: false, error: "User profile not found in local database." };
    }

    const internalUserId = internalUser.id;
    
    // --- FIX APPLIED HERE ---
    // If description is undefined or empty, insert an empty string ("") 
    // instead of null to satisfy the taskTable.description.notNull() constraint.
    const finalDescription = description?.trim() || "";

    // 3. Database Insertion (using the retrieved internal foreign key ID)
    const [newTask] = await db
      .insert(taskTable)
      .values({
        // Use the internal primary key from usersTable as the foreign key
        userId: internalUserId, 
        title: title.trim(),
        description: finalDescription, // Inserting "" instead of null
        isCompleted: false, // Default status
        createdAt: new Date(),
      })
      .returning(); // Get the inserted task back

    // 4. Cache Invalidation
    revalidatePath("/tasks/dashboard");
    
    return { 
      success: true, 
      task: newTask,
      message: `Task "${title}" created successfully.` 
    };
  } catch (error) {
    console.error("Database error during task creation:", error);
    return { success: false, error: "Failed to create task due to a server error." };
  }
}
