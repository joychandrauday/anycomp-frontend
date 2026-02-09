"use client";

import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Stack,
    Container,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Avatar,
    Typography,
    Menu,
    MenuItem,
    Divider,
    Chip,
    Badge,
    alpha
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// Define user type
interface User {
    id: string;
    email: string;
    full_name: string;
    profile_image?: string;
    role: string;
}

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user as unknown as User | null;

    const hideNavbar =
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/admin/dashboard") ||
        pathname?.startsWith("/secretary/dashboard");

    if (hideNavbar) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
        handleMenuClose();
    };

    const handleDashboard = () => {
        handleMenuClose();
        // Redirect to dashboard based on user role
        if (user?.role === 'admin') {
            router.push('/admin/dashboard');
        } else if (user?.role === 'secretary') {
            router.push('/secretary/dashboard');
        } else {
            router.push('/dashboard');
        }
    };

    const handleProfile = () => {
        handleMenuClose();
        router.push('/profile');
    };

    const handleSettings = () => {
        handleMenuClose();
        router.push('/settings');
    };

    // Centralized style for the text links
    const navLinkStyle = {
        color: "text.primary",
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '0.85rem',
        whiteSpace: 'nowrap',
        '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
    };

    // Role color mapping
    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'secretary':
                return 'warning';
            case 'premium':
                return 'success';
            default:
                return 'primary';
        }
    };

    // Mock notifications data
    const notifications = [
        { id: 1, text: 'Your company registration is approved', time: '2 hours ago', read: false },
        { id: 2, text: 'New message from your secretary', time: '1 day ago', read: true },
        { id: 3, text: 'Document ready for review', time: '2 days ago', read: false },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderBottom: "1px solid #eaeaea",
                position: 'sticky',
                top: 0,
                zIndex: 1100
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 80 }}>

                    {/* LOGO */}
                    <Box sx={{ flexShrink: 0, mr: 2 }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src="/anycomp.png"
                                alt="anycomp logo"
                                width={200}
                                height={35}
                                style={{ objectFit: 'contain' }}
                                className="invert"
                            />
                        </Link>
                    </Box>

                    {/* ALL NAV LINKS */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ display: { xs: 'none', lg: 'flex' }, flexGrow: 1, justifyContent: 'center' }}
                    >
                        <Button component={Link} href="/" sx={navLinkStyle}>Register a company</Button>
                        <Button component={Link} href="/" sx={navLinkStyle}>Appoint a Secretary</Button>
                        <Button component={Link} href="/" sx={navLinkStyle}>Secretarial Services</Button>
                        <Button component={Link} href="/" sx={navLinkStyle}>How Anycomp Works</Button>
                    </Stack>

                    {/* SEARCH & AUTH ACTIONS */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
                        {/* SEARCH BAR */}
                        <Box component="form" onSubmit={handleSearch} sx={{ width: { xs: 120, xl: 200 } }}>
                            <TextField
                                size="small"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ padding: 0, margin: 0 }}>
                                            <IconButton
                                                size="small"
                                                type="submit"
                                                sx={{
                                                    backgroundColor: "#002F70",
                                                    color: "#ffffff",
                                                    borderRadius: "0 6px 6px 0",
                                                    padding: "6px",
                                                    marginRight: "-16px",
                                                    "&:hover": { backgroundColor: "#001f4d" },
                                                }}
                                            >
                                                <SearchIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: "#f5f5f5",
                                        fontSize: '0.8rem',
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                                    }
                                }}
                            />
                        </Box>

                        {/* USER MENU OR AUTH BUTTONS */}
                        {user ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                {/* NOTIFICATIONS */}
                                <IconButton
                                    size="small"
                                    onClick={handleNotificationsOpen}
                                    sx={{
                                        color: 'text.primary',
                                        backgroundColor: 'action.hover',
                                        '&:hover': {
                                            backgroundColor: alpha('#002F70', 0.08),
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    <Badge badgeContent={unreadCount} color="error" max={9}>
                                        <NotificationsIcon fontSize="small" />
                                    </Badge>
                                </IconButton>

                                <Menu
                                    anchorEl={notificationsAnchorEl}
                                    open={Boolean(notificationsAnchorEl)}
                                    onClose={handleNotificationsClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 320,
                                            maxWidth: 380,
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <Box sx={{ px: 2, py: 1.5 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Notifications
                                            {unreadCount > 0 && (
                                                <Chip
                                                    label={`${unreadCount} new`}
                                                    size="small"
                                                    color="error"
                                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <MenuItem
                                                key={notification.id}
                                                sx={{
                                                    py: 1.5,
                                                    borderLeft: notification.read ? 'none' : '3px solid',
                                                    borderLeftColor: 'primary.main',
                                                    backgroundColor: notification.read ? 'transparent' : alpha('#002F70', 0.04)
                                                }}
                                            >
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                                                        {notification.text}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.primary" sx={{ mt: 0.5 }}>
                                                        {notification.time}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            <Typography variant="body2" color="text.pr" sx={{ py: 2 }}>
                                                No notifications
                                            </Typography>
                                        </MenuItem>
                                    )}
                                    <Divider />
                                    <MenuItem onClick={handleNotificationsClose} sx={{ justifyContent: 'center', py: 1 }}>
                                        <Typography variant="caption" color="primary">
                                            View all notifications
                                        </Typography>
                                    </MenuItem>
                                </Menu>

                                {/* USER PROFILE */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 0.5,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: 'background.paper',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(0, 47, 112, 0.1)'
                                        }
                                    }}
                                    onClick={handleMenuOpen}
                                >
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: '#002F70',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            border: '2px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                        src={user.profile_image || undefined}
                                    >
                                        {!user.profile_image && user.full_name?.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Stack direction="column" spacing={0} sx={{ mr: 0.5 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                color: 'text.primary',
                                                lineHeight: 1.2,
                                                maxWidth: 120,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.full_name || user.email.split('@')[0]}
                                        </Typography>
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            color={getRoleColor(user.role)}
                                            sx={{
                                                height: 18,
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                    </Stack>

                                    <KeyboardArrowDownIcon
                                        sx={{
                                            fontSize: 18,
                                            color: 'text.pr',
                                            transition: 'transform 0.2s',
                                            transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                </Box>

                                {/* USER MENU */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 240,
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                            overflow: 'visible',
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            }
                                        }
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {/* User info header */}
                                    <Box sx={{ px: 2, py: 2, bgcolor: alpha('#002F70', 0.04), borderRadius: '8px 8px 0 0' }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: '#002F70',
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}
                                                src={user.profile_image || undefined}
                                            >
                                                {!user.profile_image && user.full_name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {user.full_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.primary" sx={{ display: 'block' }}>
                                                    {user.email}
                                                </Typography>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    color={getRoleColor(user.role)}
                                                    sx={{
                                                        height: 18,
                                                        fontSize: '0.6rem',
                                                        fontWeight: 600,
                                                        mt: 0.5
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Menu Items */}
                                    <MenuItem onClick={handleDashboard} sx={{ py: 1.5 }}>
                                        <DashboardIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="body2">Dashboard</Typography>
                                    </MenuItem>

                                    <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                                        <AccountCircleIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="body2">My Profile</Typography>
                                    </MenuItem>

                                    <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
                                        <SettingsIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="body2">Settings</Typography>
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            py: 1.5,
                                            color: 'error.main',
                                            '&:hover': {
                                                backgroundColor: alpha('#d32f2f', 0.08)
                                            }
                                        }}
                                    >
                                        <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
                                        <Typography variant="body2">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Stack>
                        ) : (
                            // AUTH BUTTONS when not logged in
                            <>
                                <Button
                                    component={Link}
                                    href="/login"
                                    sx={{ ...navLinkStyle, fontWeight: 600 }}
                                    startIcon={<PersonIcon fontSize="small" />}
                                >
                                    Log in
                                </Button>

                                <Button
                                    component={Link}
                                    href="/register"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        padding: "6px 18px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        boxShadow: "none",
                                        borderRadius: 2,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0, 47, 112, 0.3)'
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Stack>

                </Toolbar>
            </Container>
        </AppBar>
    );
}