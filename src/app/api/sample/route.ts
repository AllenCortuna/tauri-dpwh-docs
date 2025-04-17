import { NextResponse } from "next/server";

export const dynamic = "force-static";
export async function GET() {
  try {
    return NextResponse.json({ message: "Hello World" });
  } catch (error) {
    console.error("Error in root API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}