import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: {
      author: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Últimos Artículos
        </Typography>
        {articles.length === 0 ? (
          <Typography>Aún no hay artículos publicados. ¡Crea uno!</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {articles.map((article: any) => (
              <Card key={article.id} sx={{ height: "100%" }}>
                <CardActionArea component={Link} href={`/articles/${article.id}`} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por {article.author?.name || "Anónimo"} en {" "}
                      {article.category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
