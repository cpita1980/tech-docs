import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse(JSON.stringify({ error: "ID is required" }), { status: 400 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: id, published: true },
      include: { author: true, category: true },
    });

    if (!article) {
      return new NextResponse(JSON.stringify({ error: "Article not found" }), { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
}
