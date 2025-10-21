import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

// POST - Crear una nueva página
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookId, chapterId, title, content, published } = await request.json();

    if (!bookId || !title) {
      return NextResponse.json(
        { error: 'Book ID and title are required' },
        { status: 400 }
      );
    }

    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // If chapterId provided, verify it exists and belongs to the book
    if (chapterId) {
      const chapter = await prisma.chapter.findFirst({
        where: { id: chapterId, bookId },
      });

      if (!chapter) {
        return NextResponse.json(
          { error: 'Chapter not found or does not belong to this book' },
          { status: 404 }
        );
      }
    }

    // Generate unique slug within the book
    const baseSlug = slugify(title);
    const existingPages = await prisma.page.findMany({
      where: { bookId },
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      baseSlug,
      existingPages.map((p) => p.slug)
    );

    // Get the highest position
    const lastPage = await prisma.page.findFirst({
      where: {
        bookId,
        chapterId: chapterId || null,
      },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newPage = await prisma.page.create({
      data: {
        slug,
        title,
        content: content || { blocks: [] },
        published: published || false,
        position: (lastPage?.position || 0) + 1,
        bookId,
        chapterId: chapterId || null,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        chapter: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'created',
        entityType: 'page',
        entityId: newPage.id,
        userId: session.user.id,
        bookId,
        chapterId: chapterId || undefined,
        pageId: newPage.id,
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Page Create Error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
