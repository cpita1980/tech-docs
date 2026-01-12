'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react'; // Added Suspense here
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter is needed in LoginForm
import Link from 'next/link';
import { Box, Button, Container, TextField, Typography, Paper, Alert, Divider, CircularProgress } from '@mui/material'; // Added CircularProgress
import Header from '@/components/Header';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
            callbackUrl,
        });

        if (res?.error) {
            setError('Invalid email or password');
            setLoading(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, bgcolor: '#112240', borderRadius: 2, border: '1px solid #233554' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{
                        fontWeight: 'bold',
                        color: '#00f3ff', // Electric Blue
                        textShadow: '0 0 10px rgba(0, 243, 255, 0.3)'
                    }}>
                        GKDOCS
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#8892b0' }}>
                        Welcome back.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: '#8892b0' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#00f3ff' },
                            '& .MuiOutlinedInput-root': {
                                color: '#ccd6f6',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                '& fieldset': { borderColor: '#233554' },
                                '&:hover fieldset': { borderColor: '#8892b0' },
                                '&.Mui-focused fieldset': { borderColor: '#00f3ff' },
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: '#8892b0' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#00f3ff' },
                            '& .MuiOutlinedInput-root': {
                                color: '#ccd6f6',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                '& fieldset': { borderColor: '#233554' },
                                '&:hover fieldset': { borderColor: '#8892b0' },
                                '&.Mui-focused fieldset': { borderColor: '#00f3ff' },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            bgcolor: '#00f3ff',
                            color: '#020c1b',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#00c2cc' },
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <Divider sx={{ my: 3, borderColor: '#444' }}>OR</Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => signIn('google', { callbackUrl })}
                    sx={{ mb: 2, color: 'white', borderColor: '#444', '&:hover': { borderColor: '#00f3ff' } }}
                >
                    Sign in with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    onClick={() => signIn('github', { callbackUrl })}
                    sx={{ color: 'white', borderColor: '#444', '&:hover': { borderColor: '#00f3ff' } }}
                >
                    Sign in with GitHub
                </Button>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link href="/register" style={{ color: '#00f3ff', textDecoration: 'none' }}>
                        Don&apos;t have an account? Sign Up
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

export default function LoginPage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#121212', color: 'white' }}>
            <Header />
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>}>
                <LoginForm />
            </Suspense>
        </Box>
    );
}
