import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { articleUpdateSchema } from "@/lib/validations";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const article = await prisma.article.findUnique({
            where: { id },
            include: { author: true, category: true },
        });

        if (!article) {
            return new NextResponse(JSON.stringify({ error: "Article not found" }), { status: 404 });
        }

        return NextResponse.json(article);
    } catch {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch article" }), { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session || !session.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const json = await request.json();
        const body = articleUpdateSchema.safeParse(json);

        if (!body.success) {
            return new NextResponse(JSON.stringify({ error: body.error }), { status: 400 });
        }

        const article = await prisma.article.findUnique({
            where: { id },
        });

        if (!article) {
            return new NextResponse(JSON.stringify({ error: "Article not found" }), { status: 404 });
        }

        if (article.authorId !== session.user.id) {
            return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                ...body.data,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content: body.data.content as any,
            },
        });

        return NextResponse.json(updatedArticle);
    } catch {
        return new NextResponse(JSON.stringify({ error: "Failed to update article" }), { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session || !session.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const article = await prisma.article.findUnique({
            where: { id },
        });

        if (!article) {
            return new NextResponse(JSON.stringify({ error: "Article not found" }), { status: 404 });
        }

        if (article.authorId !== session.user.id) {
            return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        await prisma.article.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch {
        return new NextResponse(JSON.stringify({ error: "Failed to delete article" }), { status: 500 });
    }
}