import { db } from "@/db";
import { publicTaskLinkTable, taskTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";


interface PublicTaskPageProps {
  params: { token: string };
  searchParams: Record<string, string | string[]>; // required even if unused
}

export default async function PublicTaskPage({ params }: PublicTaskPageProps) {
  const { token } = params;

  // Fetch public link with task
  const publicLink = await db
    .select({
      taskId: publicTaskLinkTable.taskId,
      taskTitle: taskTable.title,
      taskDescription: taskTable.description,
      ownerName: usersTable.name,
      expiresAt: publicTaskLinkTable.expiresAt,
    })
    .from(publicTaskLinkTable)
    .leftJoin(taskTable, eq(taskTable.task_id, publicTaskLinkTable.taskId)) // ✅ use eq()
  .leftJoin(usersTable, eq(usersTable.id, publicTaskLinkTable.userId))
  .where(eq(publicTaskLinkTable.token, token))
    .limit(1);

  if (!publicLink[0]) {
    return notFound();
  }

  const task = publicLink[0];

  // Check if link is expired
  const now = new Date();
  if (task.expiresAt < now) {
    return (
      <div className="p-8 max-w-2xl mx-auto font-sans">
        <h1 className="text-3xl font-bold text-gray-900">Link Expired</h1>
        <p className="text-gray-500 mt-4">This public link has expired.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.taskTitle}</h1>
      <p className="text-sm text-gray-500 mb-4">Owner: {task.ownerName}</p>
      <p className="text-gray-700">{task.taskDescription}</p>
    </div>
  );
}
