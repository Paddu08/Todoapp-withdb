import { currentUser } from "@clerk/nextjs/server";
import TodoForm from "./components/Todoform"; // Note the relative path change
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';

export default async function CreateTaskPage() {
  // 1. Fetch user details securely on the server
  const user = await currentUser(); 
  const authId = user?.id;

  if (!authId) {
    return <p className="p-8 text-center text-xl text-red-700 font-semibold">
      Authentication Required. Please log in to create a task.
    </p>;
  }

  return (
    <div className="font-sans p-8 min-h-screen flex flex-col gap-8 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <Link href="/dashboard" passHref>
        <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        New Task
      </h1>

      {/* Render the Client Component (TodoForm) and pass the userId prop */}
      <div className="w-full">
        {/*
          IMPORTANT: We pass the userId here, but the security check 
          in the Server Action (createTask) still relies on currentUser() 
          for ultimate validation.
        */}
        <TodoForm userId={authId} />
      </div>
    </div>
  );
}
