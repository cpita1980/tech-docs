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
  Pagination,
  PaginationItem,
  Stack,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";

const POSTS_PER_PAGE = 9;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.article.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(totalArticles / POSTS_PER_PAGE);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Documentación Técnica
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Tu hub central de conocimiento y recursos.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {articles.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Aún no hay artículos publicados.
            </Typography>
            <Typography sx={{ mt: 1 }}>
              ¡Sé el primero en compartir tu conocimiento!
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={4}>
              {articles.map((article) => (
                <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2
                    }}
                    elevation={2}
                  >
                    <CardActionArea component={Link} href={`/article?id=${article.id}`} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", p: 0 }}>
                      <CardContent sx={{ p: 3, width: "100%", flexGrow: 1 }}>
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={article.category.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "3.2em",
                          lineHeight: 1.3
                        }}>
                          {article.title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                          <Avatar
                            src={article.author?.image || ""}
                            alt={article.author?.name || "Author"}
                            sx={{ width: 32, height: 32, mr: 1.5 }}
                          >
                            {(article.author?.name || "A")[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" component="div">
                              {article.author?.name || "Anónimo"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(article.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    color="primary"
                    size="large"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        href={`/?page=${item.page || 1}`}
                        {...item}
                      />
                    )}
                  />
                </Stack>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
