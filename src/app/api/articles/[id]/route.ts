import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest, // Use NextRequest for more specific typing
  { params }: { params: { id: string } }
): Promise<NextResponse> { // Explicitly type the return promise
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: params.id,
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
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article GET API Error:", error);
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}