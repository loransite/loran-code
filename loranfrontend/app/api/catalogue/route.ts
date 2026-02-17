// app/api/catalogue/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/catalogue`);
  const data = await res.json();
  return NextResponse.json(data);
}