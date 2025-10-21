import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Tech Docs",
  description: "Your personal knowledge hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
