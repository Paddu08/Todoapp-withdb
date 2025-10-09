// app/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard"); 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1>Welcome! Please sign in</h1>
      <SignInButton mode="modal">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Sign In
        </button>
      </SignInButton>
    </div>
  );
}
