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
    Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Centralized style for the text links
    const navLinkStyle = {
        color: "text.primary", // #222222 from your theme
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '0.85rem', // Slightly smaller to fit all links
        whiteSpace: 'nowrap',
        '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderBottom: "1px solid #eaeaea"
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
                                        <InputAdornment
                                            position="end"
                                            sx={{
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                type="submit"
                                                sx={{
                                                    backgroundColor: "#002F70",
                                                    color: "#ffffff",
                                                    borderRadius: "0 6px 6px 0",
                                                    padding: "6px",
                                                    marginRight: "-16px", // pulls it tight to the edge
                                                    "&:hover": {
                                                        backgroundColor: "#001f4d",
                                                    },
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

                        {/* AUTH BUTTONS */}
                        <Button
                            component={Link}
                            href="/login"
                            sx={{ ...navLinkStyle, fontWeight: 600 }}
                        >
                            Log in
                        </Button>

                        <Button
                            component={Link}
                            href="/register"
                            variant="contained"
                            color="primary" // Uses #002F70
                            sx={{

                                padding: "6px 18px",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                boxShadow: "none"
                            }}
                        >
                            Register
                        </Button>
                    </Stack>

                </Toolbar>
            </Container>
        </AppBar>
    );
}