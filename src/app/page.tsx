import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import prisma from "@/lib/prisma";
import {
  Container,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const books = await prisma.book.findMany({
    where: { published: true },
    include: {
      _count: {
        select: {
          chapters: true,
          pages: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" component="h1">
            Biblioteca de Documentación
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/admin/books/new"
          >
            Nuevo Libro
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Explora nuestra colección de libros, capítulos y páginas de documentación técnica
        </Typography>

        {books.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay libros disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comienza creando tu primer libro de documentación
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              href="/admin/books/new"
              size="large"
            >
              Crear Primer Libro
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                slug={book.slug}
                name={book.name}
                description={book.description}
                cover={book.cover}
                pagesCount={book._count.pages}
                chaptersCount={book._count.chapters}
                updatedAt={book.updatedAt}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
