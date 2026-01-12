'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import Header from '@/components/Header';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/api/auth/signin');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'var(--background)', color: 'var(--foreground)' }}>
            <Header />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4, bgcolor: 'var(--card-bg)', borderRadius: 2, border: '1px solid var(--border)' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" sx={{
                            fontWeight: 'bold',
                            color: 'var(--primary)',
                            textShadow: 'none' // Removed neon shadow for readability
                        }}>
                            GKDOCS
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'var(--secondary)' }}>
                            Create your account
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'var(--secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--foreground)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    '& fieldset': { borderColor: 'var(--border)' },
                                    '&:hover fieldset': { borderColor: 'var(--foreground)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                            }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'var(--secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--foreground)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    '& fieldset': { borderColor: 'var(--border)' },
                                    '&:hover fieldset': { borderColor: 'var(--foreground)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
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
                                '& .MuiInputLabel-root': { color: 'var(--secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--foreground)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    '& fieldset': { borderColor: 'var(--border)' },
                                    '&:hover fieldset': { borderColor: 'var(--foreground)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                bgcolor: 'var(--primary)',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 },
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link href="/api/auth/signin" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
