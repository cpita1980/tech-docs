import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un artículo específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const article = await prisma.article.findUnique({
      where: { id, published: true },
      include: { author: true, category: true },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Article Fetch Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// PUT - Actualizar un artículo
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { title, content, categoryId, published } = await request.json();

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        published,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Article Update Error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE - Eliminar un artículo
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Article Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}