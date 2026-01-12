'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'var(--border)',
        bgcolor: 'rgba(15, 23, 42, 0.85)', // Slate 950 with opacity
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              color: 'var(--primary)',
              textDecoration: 'none',
              letterSpacing: '1px',
              fontStyle: 'normal',
            }}
          >
            GKDOCS
          </Typography>

          {status === 'loading' ? (
            <Box sx={{ width: 40 }} />
          ) : session ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/admin/new-post"
                variant="contained"
                disableElevation
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'white',
                  bgcolor: 'var(--primary)',
                  '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 }
                }}
              >
                Crear Post
              </Button>
              <IconButton sx={{ p: 0, border: '2px solid', borderColor: 'var(--primary)' }}>
                <Avatar
                  alt={session.user?.name || 'User'}
                  src={session.user?.image || ''}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Button
                color="inherit"
                onClick={() => signOut()}
                sx={{ textTransform: 'none', color: 'var(--secondary)', '&:hover': { color: 'var(--foreground)' } }}
              >
                Salir
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/login"
                color="inherit"
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: 'var(--foreground)' }}
              >
                Inicia Sesión
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'white',
                  bgcolor: 'var(--primary)',
                  '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 }
                }}
              >
                Regístrate
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
