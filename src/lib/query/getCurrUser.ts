"use server"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema"; 

export async function getCurrUser(authId: string) {
    const users = await db.select({ id: usersTable.id, })
    .from(usersTable)
    .where(eq(usersTable.auth_id, authId))
    .limit(1);

  const user = users[0];

  return user
    
}
