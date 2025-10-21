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

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tech Docs
          </Typography>

          {status === 'loading' ? (
            <div />
          ) : session ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button component={Link} href="/admin/books/new" variant="contained" color="secondary" sx={{ mr: 2 }}>
                Nuevo Libro
              </Button>
              <IconButton sx={{ p: 0, mr: 1.5 }}>
                <Avatar alt={session.user?.name || 'User'} src={session.user?.image || ''} />
              </IconButton>
              <Button color="inherit" onClick={() => signOut()}>Logout</Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => signIn()}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
