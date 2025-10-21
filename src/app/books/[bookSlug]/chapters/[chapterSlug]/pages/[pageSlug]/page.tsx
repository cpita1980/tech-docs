import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleRenderer from '@/components/ArticleRenderer';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { OutputData } from '@editorjs/editorjs';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ChapterPageViewProps {
  params: Promise<{ bookSlug: string; chapterSlug: string; pageSlug: string }>;
}

export default async function ChapterPageView({ params }: ChapterPageViewProps) {
  const { bookSlug, chapterSlug, pageSlug } = await params;

  const page = await prisma.page.findFirst({
    where: {
      slug: pageSlug,
      chapter: { slug: chapterSlug },
      book: { slug: bookSlug },
      published: true,
    },
    include: {
      book: true,
      chapter: {
        include: {
          pages: {
            where: { published: true },
            orderBy: { position: 'asc' },
            select: { slug: true, title: true },
          },
        },
      },
      author: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!page || !page.chapter) {
    notFound();
  }

  // Find previous and next pages
  const currentPageIndex = page.chapter.pages.findIndex(p => p.slug === pageSlug);
  const previousPage = currentPageIndex > 0 ? page.chapter.pages[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < page.chapter.pages.length - 1 ? page.chapter.pages[currentPageIndex + 1] : null;

  const breadcrumbItems = [
    { label: 'Libros', href: '/' },
    { label: page.book.name, href: `/books/${bookSlug}` },
    { label: page.chapter.name },
    { label: page.title },
  ];

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4, maxWidth: 'lg' }}>
        <Breadcrumbs items={breadcrumbItems} />

        <Paper elevation={0} sx={{ p: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" color="text.secondary">
              {page.chapter.name}
            </Typography>

            <Typography variant="h3" component="h1" gutterBottom>
              {page.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>
              <Chip
                label={`Por ${page.author?.name || 'Anónimo'}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Actualizado: ${new Date(page.updatedAt).toLocaleDateString()}`}
                size="small"
                variant="outlined"
              />

              {page.tags.map(({ tag }) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  sx={{
                    bgcolor: tag.color || 'primary.light',
                    color: 'white',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Page Content */}
          <Box sx={{ mt: 4 }}>
            <ArticleRenderer data={page.content as OutputData} />
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <Box>
              {previousPage && (
                <Button
                  component={Link}
                  href={`/books/${bookSlug}/chapters/${chapterSlug}/pages/${previousPage.slug}`}
                  startIcon={<NavigateBefore />}
                  variant="outlined"
                >
                  {previousPage.title}
                </Button>
              )}
            </Box>

            <Box>
              {nextPage && (
                <Button
                  component={Link}
                  href={`/books/${bookSlug}/chapters/${chapterSlug}/pages/${nextPage.slug}`}
                  endIcon={<NavigateNext />}
                  variant="outlined"
                >
                  {nextPage.title}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
