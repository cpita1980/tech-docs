'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'My Documents', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Folders', icon: <FolderIcon />, path: '/folders' },
    { text: 'New Post', icon: <AddCircleIcon />, path: '/admin/new-post' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <Box
            sx={{
                width: 280,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bgcolor: '#112240', // Card BG color
                borderRight: '1px solid #233554',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                zIndex: 1200,
            }}
        >
            {/* Logo Area */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Placeholder for Logo Icon */}
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'primary.contrastText'
                    }}
                >
                    G
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: 1 }}>
                    GKDOCS
                </Typography>
            </Box>

            <Divider sx={{ borderColor: '#233554' }} />

            {/* Navigation */}
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                    color: isActive ? 'primary.main' : '#8892b0',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 243, 255, 0.05)',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : '#8892b0'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Actions */}
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    sx={{
                        borderRadius: 2,
                        color: '#8892b0',
                        '&:hover': { color: 'white' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: '#8892b0' }}>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>
            </Box>
        </Box>
    );
}
