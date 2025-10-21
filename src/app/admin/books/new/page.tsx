'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover: '',
    published: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create book');
      }

      const book = await response.json();
      router.push(`/books/${book.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4, maxWidth: 'md' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Libro
        </Typography>

        <Paper sx={{ p: 4, mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Libro"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              margin="normal"
              helperText="El nombre del libro, por ejemplo: 'Manual de Usuario'"
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              margin="normal"
              helperText="Una breve descripción de qué contiene este libro"
            />

            <TextField
              label="URL de la Portada (opcional)"
              fullWidth
              value={formData.cover}
              onChange={(e) => handleChange('cover', e.target.value)}
              margin="normal"
              placeholder="https://ejemplo.com/imagen.jpg"
              helperText="URL de una imagen para la portada del libro"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                />
              }
              label="Publicar inmediatamente"
              sx={{ mt: 2, display: 'block' }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading || !formData.name}
              >
                {loading ? 'Creando...' : 'Crear Libro'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
