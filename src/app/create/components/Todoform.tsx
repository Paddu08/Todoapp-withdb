"use client";

import { useState } from 'react';
// Assuming the Server Action is exported via the central barrel file
import { createTask } from '@/lib/actions/createTask'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Shadcn icon

// This component accepts userId, which is passed from the parent Server Component (app/create/page.tsx)
export default function TodoForm({ userId }: { userId?: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // If the Server Component failed to provide a userId (e.g., if rendering failed)
  if (!userId) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardContent className="p-6 text-center text-red-600">
          Authentication Error: Cannot render form without a valid User ID.
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setIsSubmitting(true);

    // Call the Server Action
    // NOTE: The actual user ID is verified server-side by `currentUser()` inside `createTask`.
    const result = await createTask(title.trim(), description.trim());

    if (result.success) {
      setSuccess(true);
      setTitle('');
      setDescription('');
    } else {
      // Display error from the server action (e.g., "Authentication required")
      setError(result.error || "Failed to create task due to an unknown server error.");
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo-700">Add New Task</CardTitle>
        <CardDescription>
          Enter the details for the task you want to create.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Status Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md border border-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md border border-green-300">
              Task successfully created! Redirecting you to the dashboard...
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Task Title</label>
            <Input
              id="title"
              placeholder="e.g., Complete dashboard redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              id="description"
              placeholder="Add detailed notes about the task."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
