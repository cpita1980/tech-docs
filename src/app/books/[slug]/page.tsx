import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Description as PageIcon,
  Folder as ChapterIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug, published: true },
    include: {
      author: true,
      chapters: {
        where: { published: true },
        include: {
          pages: {
            where: { published: true },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
      pages: {
        where: {
          published: true,
          chapterId: null, // Solo páginas directas del libro
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!book) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Libros', href: '/' },
    { label: book.name },
  ];

  const totalPages = book.pages.length + book.chapters.reduce((sum, ch) => sum + ch.pages.length, 0);

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Book Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {book.name}
          </Typography>

          {book.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {book.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            <Chip label={`${book.chapters.length} capítulos`} size="small" />
            <Chip label={`${totalPages} páginas`} size="small" />
            <Chip
              label={`Por ${book.author?.name || 'Anónimo'}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Table of Contents */}
        <Paper elevation={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Tabla de Contenidos
            </Typography>
          </Box>

          <Divider />

          <List>
            {/* Páginas directas del libro (sin capítulo) */}
            {book.pages.map((page) => (
              <ListItem key={page.id} disablePadding>
                <ListItemButton
                  component={Link}
                  href={`/books/${book.slug}/pages/${page.slug}`}
                >
                  <ListItemIcon>
                    <PageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={page.title}
                    secondary={`Actualizado: ${new Date(page.updatedAt).toLocaleDateString()}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Capítulos con sus páginas */}
            {book.chapters.map((chapter) => (
              <Box key={chapter.id}>
                <ListItem sx={{ bgcolor: 'action.hover' }}>
                  <ListItemIcon>
                    <ChapterIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {chapter.name}
                      </Typography>
                    }
                    secondary={chapter.description}
                  />
                  <Chip label={`${chapter.pages.length} páginas`} size="small" />
                </ListItem>

                {chapter.pages.length > 0 && (
                  <List disablePadding>
                    {chapter.pages.map((page) => (
                      <ListItem key={page.id} disablePadding>
                        <ListItemButton
                          component={Link}
                          href={`/books/${book.slug}/chapters/${chapter.slug}/pages/${page.slug}`}
                          sx={{ pl: 8 }}
                        >
                          <ListItemIcon>
                            <PageIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={page.title}
                            secondary={`Actualizado: ${new Date(page.updatedAt).toLocaleDateString()}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Divider />
              </Box>
            ))}
          </List>

          {book.pages.length === 0 && book.chapters.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Este libro aún no tiene contenido
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
