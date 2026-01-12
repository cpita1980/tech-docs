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
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
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
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              letterSpacing: '-0.5px'
            }}
          >
            Tech Docs
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
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Crear Post
              </Button>
              <IconButton sx={{ p: 0, border: '2px solid', borderColor: 'primary.light' }}>
                <Avatar
                  alt={session.user?.name || 'User'}
                  src={session.user?.image || ''}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Button
                color="inherit"
                onClick={() => signOut()}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Salir
              </Button>
            </Box>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => signIn()}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Iniciar Sesión
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
