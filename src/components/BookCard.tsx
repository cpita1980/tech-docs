'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { MenuBook as BookIcon } from '@mui/icons-material';

interface BookCardProps {
  slug: string;
  name: string;
  description?: string | null;
  cover?: string | null;
  pagesCount?: number;
  chaptersCount?: number;
  updatedAt: Date | string;
}

export default function BookCard({
  slug,
  name,
  description,
  cover,
  pagesCount = 0,
  chaptersCount = 0,
  updatedAt,
}: BookCardProps) {
  const updatedDate = new Date(updatedAt);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea component={Link} href={`/books/${slug}`} sx={{ flexGrow: 1 }}>
        {cover ? (
          <CardMedia
            component="img"
            height="160"
            image={cover}
            alt={name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <BookIcon sx={{ fontSize: 80, opacity: 0.5 }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {name}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 2,
                minHeight: '2.5em',
              }}
            >
              {description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {chaptersCount > 0 && (
              <Chip
                label={`${chaptersCount} ${chaptersCount === 1 ? 'capítulo' : 'capítulos'}`}
                size="small"
                variant="outlined"
              />
            )}
            {pagesCount > 0 && (
              <Chip
                label={`${pagesCount} ${pagesCount === 1 ? 'página' : 'páginas'}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Actualizado: {updatedDate.toLocaleDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
