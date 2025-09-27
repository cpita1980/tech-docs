import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Find or create a category
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return new NextResponse(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category API Error:", error);
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
}
