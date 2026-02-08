'use client'
import { Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { ISecretary } from "@/types";

export default function Hero({ user }: { user: ISecretary[] }) {

    // Create people array dynamically from user data
    const people = user.slice(0, 3).map((secretary, index) => ({
        // Convert string ID to number for AnimatedTooltip compatibility
        id: index + 1, // Use index as number ID
        name: secretary.user?.full_name || "Company Secretary",
        designation: secretary.qualification || "Company Secretary",
        image: secretary.avatar ||
            secretary.user?.profile_image ||
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    }));

    return (
        <Container sx={{ py: 12 }} className='min-h-screen'>
            <Grid container spacing={6} alignItems="center">
                {/* LEFT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Register your Company
                    </Typography>

                    <Typography color="text" sx={{ mb: 4 }}>
                        Incorporate Your Company, Appoint a Secretary & Manage Everything in One Platform
                    </Typography>

                    <div className="flex items-center gap-6 mb-8">
                        <Button
                            component={Link}
                            href="/register"
                            variant="contained"
                            size="large"
                        >
                            Get Started
                        </Button>

                        <div className="secretary-section flex gap-6 items-center" >
                            <div className="secretary-images flex">
                                <AnimatedTooltip items={people} />
                            </div>
                            <h2 className="text-gray-400 font-bold text-md">Find and Appoint any Company Secretary</h2>
                        </div>
                    </div>
                </Grid>

                {/* RIGHT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <ImageSlider />
                </Grid>
            </Grid>
        </Container >
    );
}