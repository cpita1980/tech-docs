'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import { Container, Typography, Box, CircularProgress, TextField, Button } from '@mui/material';
import { OutputData } from '@editorjs/editorjs';

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<OutputData>();

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

  const handleSave = () => {
    console.log("Title:", title);
    console.log("Content:", content);
    // Aquí irá la lógica para llamar a la API y guardar
    alert("Funcionalidad de guardado no implementada aún. Revisa la consola del navegador.");
  };

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Artículo
        </Typography>
        
        <TextField
          label="Título del Artículo"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Editor data={content} onChange={setContent} />

        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
          Guardar Artículo
        </Button>
      </Container>
    </Box>
  );
}