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
        borderColor: '#333',
        bgcolor: 'rgba(18, 18, 18, 0.95)',
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
              color: 'primary.main',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
              fontStyle: 'italic'
            }}
          >
            Nano Banana Pro
          </Typography>

          {status === 'loading' ? (
            <Box sx={{ width: 40 }} />
          ) : session ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/admin/new-post"
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'black',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: '#E6C200' }
                }}
              >
                Crear Post
              </Button>
              <IconButton sx={{ p: 0, border: '2px solid', borderColor: 'primary.main' }}>
                <Avatar
                  alt={session.user?.name || 'User'}
                  src={session.user?.image || ''}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Button
                color="inherit"
                onClick={() => signOut()}
                sx={{ textTransform: 'none', color: '#888', '&:hover': { color: 'white' } }}
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
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: 'white' }}
              >
                Inicia Sesión
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'black',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: '#E6C200' }
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
