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
} from '@mui/material';
import { OutputData } from '@editorjs/editorjs';

export const dynamic = 'force-dynamic';

interface PageViewProps {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

export default async function PageView({ params }: PageViewProps) {
  const { bookSlug, pageSlug } = await params;

  const page = await prisma.page.findFirst({
    where: {
      slug: pageSlug,
      book: { slug: bookSlug },
      chapterId: null, // Solo páginas directas del libro
      published: true,
    },
    include: {
      book: true,
      author: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Libros', href: '/' },
    { label: page.book.name, href: `/books/${bookSlug}` },
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
        </Paper>
      </Container>
    </Box>
  );
}
