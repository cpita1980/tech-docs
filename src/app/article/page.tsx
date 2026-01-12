'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import ArticleRenderer from "@/components/ArticleRenderer";
import { OutputData } from '@editorjs/editorjs';

// Define a type for the article structure
interface Article {
  id: string;
  title: string;
  content: OutputData; // Use the correct type instead of any
  author: { name?: string | null };
  category: { name: string };
  createdAt: string | Date;
}

function ArticleView() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No article ID provided');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/article?id=${id}`);
        if (!response.ok) throw new Error('Article not found');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !article) {
    return <Typography variant="h4" color="error">Error: Artículo no encontrado</Typography>;
  }

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>{article.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Por {article.author?.name || "Anónimo"} en {article.category.name} - {new Date(article.createdAt).toLocaleDateString()}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <ArticleRenderer data={article.content as OutputData} />
      </Box>
    </Box>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Header />
      <Container sx={{ mt: 4 }}>
        <ArticleView />
      </Container>
    </Suspense>
  );
}
