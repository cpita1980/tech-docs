'use client';

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import ArticleRenderer from "@/components/ArticleRenderer";
import { OutputData } from '@editorjs/editorjs';

// Define a type for the article structure
interface Article {
  id: string;
  title: string;
  content: any; // Keep as any to match the data structure
  createdAt: string;
  author: { name: string | null } | null;
  category: { name: string };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${params.id}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box>
        <Header />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error">Error: Artículo no encontrado</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Por {article.author?.name || "Anónimo"} en {article.category.name} -{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ArticleRenderer data={article.content as OutputData} />
        </Box>
      </Container>
    </Box>
  );
}