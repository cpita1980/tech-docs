import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Container, Typography, Box } from "@mui/material";
import ArticleRenderer from "@/components/ArticleRenderer";
import { OutputData } from "@editorjs/editorjs";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { author: true, category: true },
  });

  if (!article || !article.published) {
    // For now, only show published articles. 
    // A future improvement could be to allow authors to see their own drafts.
    notFound();
  }

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Por {article.author?.name || "Anónimo"} en {article.category.name} -{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ArticleRenderer data={article.content as unknown as OutputData} />
        </Box>
      </Container>
    </Box>
  );
}
