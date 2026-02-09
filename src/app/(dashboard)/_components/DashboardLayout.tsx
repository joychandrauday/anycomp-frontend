"use client";

import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    alpha
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    AssignmentInd as SpecialistIcon,
    Draw as SignatureIcon,
    Settings as SettingsIcon,
    Help as HelpIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
        role?: string | null;
    };
}

export default function DashboardLayout({
    children,
    user,
}: DashboardLayoutProps) {
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const handleDrawerToggle = () => setOpen(!open);
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleProfileMenuClose();
        router.push('/login');
    };

    const mainMenuItems = {
        super_admin: [
            { text: "Admin Home", icon: <AdminIcon />, path: "/dashboard" },
            { text: "Service", icon: <SpecialistIcon />, path: "/dashboard/service" },
            { text: "Secretaries", icon: <SpecialistIcon />, path: "/dashboard/secretaries" },
            { text: "Clients", icon: <PeopleIcon />, path: "/dashboard/clients" },
            { text: "eSignature", icon: <SignatureIcon />, path: "/dashboard/esignature" },
        ],
        viewer: [
            { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { text: "Profile", icon: <PersonIcon />, path: "/dashboard/profile" },
        ],
        secretary: [
            { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { text: "Service", icon: <SpecialistIcon />, path: "/dashboard/my-service" },
        ],
    };

    const secondaryMenuItems = [
        { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
        { text: "Help Center", icon: <HelpIcon />, path: "/dashboard/help" },
    ];

    const currentMenuItems = mainMenuItems[user.role as keyof typeof mainMenuItems] || mainMenuItems.viewer;

    const renderMenuItems = (items: typeof secondaryMenuItems) => (
        items.map((item) => {
            const isActive = pathname === item.path;
            return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={() => router.push(item.path)}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            mx: 1,
                            borderRadius: 2,
                            // Active State Background
                            backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                            color: isActive ? theme.palette.primary.main : 'inherit',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: isActive ? theme.palette.primary.main : 'inherit',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{ opacity: open ? 1 : 0 }}
                            primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        })
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton onClick={handleDrawerToggle} edge="start">
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="subtitle2" sx={{ lineHeight: 1, fontWeight: 600 }}>{user.name}</Typography>
                            <Typography variant="caption" color="text.primary" sx={{ textTransform: 'capitalize' }}>
                                {user?.role && user?.role.replace('_', ' ')}
                            </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 35, height: 35 }}>
                            {user?.name && user?.name.charAt(0)}
                        </Avatar>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => router.push('/dashboard/profile')}>
                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sticky Sidebar */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedDrawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedDrawerWidth,
                        boxSizing: 'border-box',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    },
                }}
            >
                <Box>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1] }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            {open ? <>
                                <Link
                                    href="/"
                                    className="flex justify-between items-center gap-2">
                                    <Image
                                        src="/anycompicon.png"
                                        alt="anycomp logo"
                                        width={60}
                                        height={30}
                                    />AnyComp
                                </Link>
                            </> : 'A'}
                        </Typography>
                    </Toolbar>
                    <Divider />
                    <List sx={{ pt: 2 }}>
                        {renderMenuItems(currentMenuItems)}
                    </List>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Divider sx={{ mb: 1 }} />
                    <List>
                        {renderMenuItems(secondaryMenuItems)}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                minHeight: '100vh',
                backgroundColor: alpha(theme.palette.divider, 0.03)
            }}>
                <Toolbar /> {/* Spacer for sticky header */}
                <Box sx={{
                    backgroundColor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                    minHeight: 'calc(100vh - 140px)'
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}