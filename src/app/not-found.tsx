"use client";

import { Box, Typography, Button, Container, Paper, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

export default function ComingSoonPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.main',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        borderRadius: 2,
                        backgroundColor: 'white',
                        textAlign: 'center'
                    }}
                >
                    <Image
                        src="/anycompicon.png"
                        alt="Coming Soon"
                        width={180}
                        height={180}
                        className="mx-auto"
                    />
                    {/* Heading */}
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            mb: 2
                        }}
                    >
                        Coming Soon
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.primary',
                            mb: 4,
                            lineHeight: 1.6
                        }}
                    >
                        This page is currently under construction.
                        We're working hard to bring you a better experience.
                    </Typography>

                    {/* Decorative Line */}
                    <Box
                        sx={{
                            width: 80,
                            height: 4,
                            backgroundColor: 'primary.main',
                            mx: 'auto',
                            mb: 4,
                            borderRadius: 2
                        }}
                    />

                    {/* Contact Info */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.primary',
                            mb: 4
                        }}
                    >
                        For immediate assistance, please contact us at
                        <Box
                            component="span"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                ml: 1
                            }}
                        >
                            support@anycomp.com
                        </Box>
                    </Typography>

                    {/* Action Buttons */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            <ArrowBack sx={{ mr: 1 }} />
                            Go Back Home
                        </Button>

                        <Button
                            component={Link}
                            href="/contact"
                            variant="outlined"
                            sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Contact Us
                        </Button>
                    </Stack>

                    {/* Footer */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 4,
                            color: 'text.secondary'
                        }}
                    >
                        © {new Date().getFullYear()} Anycomp
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}