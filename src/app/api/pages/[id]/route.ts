import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obtener una página específica
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const page = await prisma.page.findUnique({
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
        chapter: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT - Actualizar una página
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { title, content, draft, published, position, chapterId } = await request.json();

    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (page.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If title changed, regenerate slug
    let slug = page.slug;
    if (title && title !== page.title) {
      const baseSlug = slugify(title);
      const existingPages = await prisma.page.findMany({
        where: {
          bookId: page.bookId,
          id: { not: id },
        },
        select: { slug: true },
      });
      slug = generateUniqueSlug(
        baseSlug,
        existingPages.map((p) => p.slug)
      );
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(content !== undefined && { content }),
        ...(draft !== undefined && { draft }),
        ...(published !== undefined && { published }),
        ...(position !== undefined && { position }),
        ...(chapterId !== undefined && { chapterId }),
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
        action: published && !page.published ? 'published' : 'updated',
        entityType: 'page',
        entityId: updatedPage.id,
        userId: session.user.id,
        bookId: page.bookId,
        chapterId: page.chapterId || undefined,
        pageId: updatedPage.id,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Page Update Error:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE - Eliminar una página
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user is the author or admin
    if (page.authorId !== session.user.id) {
      // TODO: Check if user has admin role
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        action: 'deleted',
        entityType: 'page',
        entityId: page.id,
        details: `Deleted page: ${page.title}`,
        userId: session.user.id,
        bookId: page.bookId,
        chapterId: page.chapterId || undefined,
      },
    });

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Page Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
