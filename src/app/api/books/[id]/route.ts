import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un libro específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        chapters: {
          include: {
            pages: {
              where: { published: true },
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
        pages: {
          where: { chapterId: null },
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            chapters: true,
            pages: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Book Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

// PUT - Actualizar un libro
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { name, description, cover, published, position } = await request.json();

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (book.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If name changed, regenerate slug
    let slug = book.slug;
    if (name && name !== book.name) {
      const baseSlug = slugify(name);
      const existingBooks = await prisma.book.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });
      slug = generateUniqueSlug(
        baseSlug,
        existingBooks.map((b) => b.slug)
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
        ...(cover !== undefined && { cover }),
        ...(published !== undefined && { published }),
        ...(position !== undefined && { position }),
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
        action: published && !book.published ? 'published' : 'updated',
        entityType: 'book',
        entityId: updatedBook.id,
        userId: session.user.id,
        bookId: updatedBook.id,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Book Update Error:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE - Eliminar un libro
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (book.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        action: 'deleted',
        entityType: 'book',
        entityId: book.id,
        details: `Deleted book: ${book.name}`,
        userId: session.user.id,
      },
    });

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Book Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
