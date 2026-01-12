import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GKDOCS",
  description: "Advanced Document Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--background)' }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                ml: { xs: 0, md: '280px' }, // Offset for sidebar
                width: { xs: '100%', md: `calc(100% - 280px)` }
              }}
            >
              {children}
            </Box>
          </Box>
        </NextAuthProvider>
      </body>
    </html>
  );
}
