import { db } from "@/db";
import { usersTable } from "@/db/schema";
export async function getUsers() {
    
const users=await db.select({
    userId:usersTable.id,
    name:usersTable.name,
}).from(usersTable)
return users

}
