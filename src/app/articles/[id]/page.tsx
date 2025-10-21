import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import ArticleRenderer from '@/components/ArticleRenderer';
import { Container, Typography, Box } from '@mui/material';
import { OutputData } from '@editorjs/editorjs';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id, published: true },
    include: {
      author: true,
      category: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Por {article.author?.name || 'Anónimo'} en {article.category.name} -{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ArticleRenderer data={article.content as OutputData} />
        </Box>
      </Container>
    </Box>
  );
}