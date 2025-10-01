'use client'
import { useState } from "react"
export default function Home() {
  const [test,setTest]=useState([])
  console.log(test)
  const handleClick= async ()=>{
    try {
      const res = await fetch("/api/todos/create")

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setTest(data.todos)
      console.log("Todo created:", data);
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  

  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      </main>
      <button onClick={()=>{
        handleClick()

      }}>click</button>
     
    </div>
  );
}
