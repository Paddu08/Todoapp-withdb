import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
export async function GET(request: Request) {
  try {
   
    const json = await res.json();

    // Send back to client
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}
