import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Header from "@/components/Header";
import { Container, Typography, Box } from "@mui/material";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin/new-post");
  }

  return (
    <Box>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Artículo
        </Typography>
        <Typography variant="body1">
          Próximamente: El editor de artículos se integrará aquí.
        </Typography>
      </Container>
    </Box>
  );
}
