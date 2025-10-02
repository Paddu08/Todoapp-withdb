// Assuming these are available as part of your project setup
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getTasksByAuthId } from "@/lib/query/getTasksCurrUser"; 
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
// import TodoForm from "./components/Todoform";

// Define a type for clarity, based on the assumed properties in your original component



export default async function Dashboard() {
  // Fetch user details on the server
  const user = await currentUser(); 
  const authId = user?.id;
  const firstName = user?.firstName || "Guest";

  if (!authId) {
    // If user is not authenticated, show a login prompt
    return <p className="p-8 text-center text-lg">Please log in to see your dashboard.</p>;
  }

  // 🚀 DIRECT SERVER CALL: Fetches data before the page loads
  // Replace with your actual import:
  // const todos = await getTasksByAuthId(authId); 
  const todos = await getTasksByAuthId(authId); 
  
  return (
    <div className="font-sans p-8 min-h-screen flex flex-col gap-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Welcome back, <span className="text-indigo-600">{firstName}</span>
      </h1>

      {/* Todo Form component (Mutation) */}
      {/* <div className="w-full">
        <TodoForm />
      </div> */}

      <h2 className="text-2xl font-semibold pb-2 text-gray-700">Task List</h2>
      <div className="mb-6">
        <Link href="/create">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            + Create New Task
          </button>
        </Link>
      </div>
      
      {todos.length === 0 ? (
        <p className="text-gray-500 italic">No tasks created yet. Use the form above to add one!</p>
      ) : (
        <div className="rounded-xl border shadow-lg">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-50">
                <TableHead className="w-[40%] text-indigo-700">Title</TableHead>
                <TableHead className="w-[40%] text-indigo-700">Description</TableHead>
                <TableHead className="w-[20%] text-indigo-700 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.task_id}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-xs truncate">{todo.description || '—'}</TableCell>
                  <TableCell className="text-center">
                    {/* Using Shadcn Badge component */}
                    <Badge variant={todo.isCompleted ? "default" : "secondary"} className={`
                        ${todo.isCompleted 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }
                        shadow-md transition-colors duration-150`}>
                      {todo.isCompleted ? 'Complete' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
