import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

// GET - Obtener todos los libros
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

  try {
    const books = await prisma.book.findMany({
      where: includeUnpublished ? {} : { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            pages: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Books Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST - Crear un nuevo libro
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, cover, published } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = slugify(name);
    const existingBooks = await prisma.book.findMany({
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      baseSlug,
      existingBooks.map((b) => b.slug)
    );

    // Get the highest position
    const lastBook = await prisma.book.findFirst({
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newBook = await prisma.book.create({
      data: {
        slug,
        name,
        description,
        cover,
        published: published || false,
        position: (lastBook?.position || 0) + 1,
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
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'created',
        entityType: 'book',
        entityId: newBook.id,
        userId: session.user.id,
        bookId: newBook.id,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Book Create Error:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
