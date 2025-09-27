import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";

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
          <Grid container spacing={4}>
            {articles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%" }}>
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
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
