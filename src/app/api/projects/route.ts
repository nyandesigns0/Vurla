import { NextResponse } from "next/server";
import { projects } from "@/lib/data/projects";

export async function GET() {
  return NextResponse.json({ projects });
}


