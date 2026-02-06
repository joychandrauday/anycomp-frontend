"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react"; // Added Suspense

import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Paper,
} from "@mui/material";

// 1. Move the form logic into a sub-component
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        setLoading(false);

        if (!res) {
            setError("Something went wrong. Please try again.");
            return;
        }

        if (res.error) {
            setError("Invalid email or password");
            return;
        }

        router.push(res.url || callbackUrl);
    }

    return (
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Sign In
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </Box>
        </Paper>
    );
}

// 2. Wrap the sub-component in Suspense in the main export
export default function LoginPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
            }}
        >
            <Suspense fallback={
                <Paper elevation={3} sx={{ p: 4, width: 400, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading Security...</Typography>
                </Paper>
            }>
                <LoginForm />
            </Suspense>
        </Box>
    );
}