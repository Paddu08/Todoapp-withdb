// app/todos/page.tsx
import { redirect } from "next/navigation";

export default function TodosPage() {
  redirect("/todos/dashboard");
}
