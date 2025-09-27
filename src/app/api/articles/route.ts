import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { title, content, categoryId, published } = await request.json();

    if (!title || !content || !categoryId) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: session.user.id,
        categoryId: categoryId,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Article Create API Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create article" }), { status: 500 });
  }
}
