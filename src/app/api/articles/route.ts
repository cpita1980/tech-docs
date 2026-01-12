import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const json = await request.json();
    const body = articleSchema.safeParse(json);

    if (!body.success) {
      return new NextResponse(JSON.stringify({ error: body.error }), { status: 400 });
    }

    const { title, content, categoryId, published } = body.data;

    const newArticle = await prisma.article.create({
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: content as any, // Prisma expects Json, Zod validates structure if we went deeper
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
