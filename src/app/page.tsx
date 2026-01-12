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
  Pagination,
  PaginationItem,
  Stack,
  Chip,
  Avatar,
  Paper,
  Button,
  Box
} from "@mui/material";

const POSTS_PER_PAGE = 9;

// Format date helper
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true, image: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.article.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(totalArticles / POSTS_PER_PAGE);
  const currentPage = page;

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Header />

      {/* Dashboard Content */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: "white" }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Welcome back to GKDOCS. Here is what&apos;s happening with your documents.
          </Typography>
        </Box>

        {/* Stats / Quick Actions Row */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "var(--card-bg)",
              border: "1px solid var(--border)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "var(--primary)", mb: 2 }}>
                Start Creating
              </Typography>
              <Typography sx={{ color: "var(--secondary)", mb: 3 }}>
                Create deep technical documentation with our advanced editor.
              </Typography>
              <Box>
                <Button
                  component={Link}
                  href="/admin/new-post"
                  variant="contained"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    bgcolor: "var(--primary)",
                    "&:hover": { bgcolor: "var(--primary)", opacity: 0.9 }
                  }}
                >
                  Create New Document
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Stats placeholder */}
            <Box sx={{ p: 4, borderRadius: 2, bgcolor: "var(--card-bg)", border: "1px solid var(--border)", height: "100%" }}>
              <Typography variant="overline" sx={{ color: "var(--secondary)" }}>Total Documents</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "var(--foreground)" }}>{totalArticles}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="bold" sx={{ color: "var(--foreground)", mb: 3 }}>
          Recent Documents
        </Typography>

        {articles.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <Typography variant="h6" color="text.secondary">
              No documents found.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(59, 130, 246, 0.15)", // var(--primary) shadow
                        borderColor: "var(--primary)"
                      },
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      bgcolor: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)"
                    }}
                    elevation={0}
                  >
                    <CardActionArea component={Link} href={`/article?id=${article.id}`} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", p: 0 }}>
                      <CardContent sx={{ p: 3, width: "100%", flexGrow: 1 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'rgba(59, 130, 246, 0.1)', // var(--primary) light
                            color: 'var(--primary)'
                          }}>
                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                          </Box>
                          <Chip
                            label={article.category.name}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: 'rgba(100, 116, 139, 0.1)', // var(--secondary) light
                              color: 'var(--secondary)',
                              border: '1px solid var(--border)'
                            }}
                          />
                        </Box>

                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                          color: 'var(--foreground)',
                          minHeight: "3.2em",
                          lineHeight: 1.3
                        }}>
                          {article.title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mt: 'auto', pt: 2, borderTop: '1px solid var(--border)' }}>
                          <Avatar
                            src={article.author?.image || ""}
                            alt={article.author?.name || "Author"}
                            sx={{ width: 24, height: 24, mr: 1, border: '1px solid var(--primary)' }}
                          >
                            {(article.author?.name || "A")[0]}
                          </Avatar>
                          <Typography variant="caption" sx={{ color: "var(--secondary)" }}>
                            {formatDate(article.createdAt)}
                          </Typography>
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
                        sx={{ color: 'var(--foreground)' }}
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
