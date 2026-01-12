'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
import { Container, Typography, Box, CircularProgress, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { OutputData } from '@editorjs/editorjs';

export default function NewPostPage() {
  const { status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState<OutputData>();
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    redirect("/api/auth/signin?callbackUrl=/admin/new-post");
  }

  const handleSave = async () => {
    if (!title || !category || !content) {
      alert("Por favor, completa todos los campos: título, categoría y contenido.");
      return;
    }
    setIsSaving(true);

    try {
      // 1. Find or create the category
      const categoryResponse = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category }),
      });
      if (!categoryResponse.ok) throw new Error('Failed to create category');
      const categoryData = await categoryResponse.json();

      // 2. Create the article
      const articleResponse = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          categoryId: categoryData.id,
          published: isPublished,
        }),
      });

      if (!articleResponse.ok) throw new Error('Failed to create article');

      alert("¡Artículo guardado con éxito!");
      router.push('/'); // Redirect to homepage

    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el artículo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4, pb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Artículo
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Título del Artículo"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Box>

        <Editor data={content} onChange={setContent} />

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControlLabel
            control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />}
            label="Publicar inmediatamente"
          />
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Guardar Artículo'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
