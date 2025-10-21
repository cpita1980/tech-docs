import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

// POST - Crear un nuevo capítulo
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookId, name, description, published } = await request.json();

    if (!bookId || !name) {
      return NextResponse.json(
        { error: 'Book ID and name are required' },
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

    // Generate unique slug within the book
    const baseSlug = slugify(name);
    const existingChapters = await prisma.chapter.findMany({
      where: { bookId },
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      baseSlug,
      existingChapters.map((c) => c.slug)
    );

    // Get the highest position in this book
    const lastChapter = await prisma.chapter.findFirst({
      where: { bookId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newChapter = await prisma.chapter.create({
      data: {
        slug,
        name,
        description,
        published: published || false,
        position: (lastChapter?.position || 0) + 1,
        bookId,
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
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'created',
        entityType: 'chapter',
        entityId: newChapter.id,
        userId: session.user.id,
        bookId,
        chapterId: newChapter.id,
      },
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error('Chapter Create Error:', error);
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 });
  }
}
