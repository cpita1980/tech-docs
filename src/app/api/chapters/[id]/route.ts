import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener un capítulo específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
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
        pages: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Chapter Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch chapter' }, { status: 500 });
  }
}

// PUT - Actualizar un capítulo
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { name, description, published, position } = await request.json();

    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (chapter.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If name changed, regenerate slug
    let slug = chapter.slug;
    if (name && name !== chapter.name) {
      const baseSlug = slugify(name);
      const existingChapters = await prisma.chapter.findMany({
        where: {
          bookId: chapter.bookId,
          id: { not: id },
        },
        select: { slug: true },
      });
      slug = generateUniqueSlug(
        baseSlug,
        existingChapters.map((c) => c.slug)
      );
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
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
        action: published && !chapter.published ? 'published' : 'updated',
        entityType: 'chapter',
        entityId: updatedChapter.id,
        userId: session.user.id,
        bookId: chapter.bookId,
        chapterId: updatedChapter.id,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('Chapter Update Error:', error);
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 });
  }
}

// DELETE - Eliminar un capítulo
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (chapter.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        action: 'deleted',
        entityType: 'chapter',
        entityId: chapter.id,
        details: `Deleted chapter: ${chapter.name}`,
        userId: session.user.id,
        bookId: chapter.bookId,
      },
    });

    await prisma.chapter.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Chapter Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 });
  }
}
