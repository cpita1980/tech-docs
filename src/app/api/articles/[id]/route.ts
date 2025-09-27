import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
        published: true, // Only return published articles
      },
      include: {
        author: true,
        category: true,
      },
    });

    if (!article) {
      return new NextResponse(JSON.stringify({ error: "Article not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article GET API Error:", error);
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}
