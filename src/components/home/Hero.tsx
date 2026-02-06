'use client'
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import ImageSlider from "./ImageSlider";

export default function Hero() {
    return (
        <Container sx={{ py: 12 }}>
            <Grid container spacing={6} alignItems="center">
                {/* LEFT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Manage Specialists. Grow Faster.
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        A modern platform to manage professionals, schedules,
                        performance, and services — all in one place.
                    </Typography>

                    <Box display="flex" gap={2}>
                        <Button
                            component={Link}
                            href="/register"
                            variant="contained"
                            size="large"
                        >
                            Get Started
                        </Button>

                        <Button
                            component={Link}
                            href="/about"
                            variant="outlined"
                            size="large"
                        >
                            Learn More
                        </Button>
                    </Box>
                </Grid>

                {/* RIGHT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <ImageSlider />
                </Grid>
            </Grid>
        </Container>
    );
}
