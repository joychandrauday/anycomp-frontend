"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    InputAdornment,
    IconButton,
    Divider,
    Chip,
} from "@mui/material";
import {
    MailOutline,
    LockOutlined,
    Visibility,
    VisibilityOff,
    ArrowForward,
    AdminPanelSettings,
    Person,
} from "@mui/icons-material";

// Login Form Component
function LoginForm() {
    const router = useRouter();
    const callbackUrl = "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

    const handleDemoAdminLogin = () => {
        setEmail("admin@example.com");
        setPassword("Admin@123");
    };
    const handleDemoSecretaryLogin = () => {
        setEmail("test.secretary7@example.com");
        setPassword("SecurePass123!");
    };

    const handleDemoUserLogin = () => {
        setEmail("user@demo.com");
        setPassword("User@123");
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                background: "#00204E",
            }}
        >
            {/* Left Side - Welcome Section */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    p: 8,
                    background: "rgba(0, 0, 0, 0.2)",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: "center" }}
                >
                    <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
                        Welcome Back
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 500 }} color="white">
                        Sign in to access your personalized dashboard and manage your account
                    </Typography>

                    {/* Demo Accounts Info */}
                    <Paper
                        sx={{
                            p: 3,
                            mt: 4,
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 2,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }} color="white">
                            <AdminPanelSettings /> Demo Accounts
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#4ade80" }} color="white">
                                    Admin Account
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }} color="white">
                                    Full system access and management privileges
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#60a5fa" }}>
                                    User Account
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }} color="white">
                                    Standard access with user-level permissions
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            </Box>

            {/* Right Side - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, sm: 4 },
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ width: "100%", maxWidth: '100%' }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                color="primary"
                                gutterBottom
                            >
                                Sign In
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Enter your credentials to access your account
                            </Typography>
                        </Box>

                        {/* Demo Account Quick Access */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Quick Access Demo Accounts:
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleDemoAdminLogin}
                                    startIcon={<AdminPanelSettings />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        borderColor: "#10b981",
                                        color: "#10b981",
                                        "&:hover": {
                                            borderColor: "#059669",
                                            backgroundColor: "rgba(16, 185, 129, 0.04)",
                                        },
                                    }}
                                >
                                    Admin Demo
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleDemoSecretaryLogin}
                                    startIcon={<Person />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        borderColor: "#3b82f6",
                                        color: "#3b82f6",
                                        "&:hover": {
                                            borderColor: "#2563eb",
                                            backgroundColor: "rgba(59, 130, 246, 0.04)",
                                        },
                                    }}
                                >
                                    Secretary Demo
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleDemoUserLogin}
                                    startIcon={<Person />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        borderColor: "#3b82f6",
                                        color: "#3b82f6",
                                        "&:hover": {
                                            borderColor: "#2563eb",
                                            backgroundColor: "rgba(59, 130, 246, 0.04)",
                                        },
                                    }}
                                >
                                    User Demo
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                or sign in manually
                            </Typography>
                        </Divider>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                            >
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        "& .MuiAlert-icon": { fontSize: 24 },
                                    }}
                                >
                                    {error}
                                </Alert>
                            </motion.div>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutline color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                        },
                                    },
                                }}
                            />

                            <Box sx={{ textAlign: "right", mb: 2 }}>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => router.push("/forgot-password")}
                                    sx={{ textTransform: "none" }}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    height: 50,
                                    borderRadius: 2,
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowForward sx={{ ml: 1 }} />
                                    </>
                                )}
                            </Button>
                        </Box>

                        {/* Demo Credentials Display */}
                        {email.includes("demo") && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginTop: 16 }}
                            >
                                <Alert
                                    severity="info"
                                    sx={{ borderRadius: 2 }}
                                >
                                    <Typography variant="body2">
                                        Using demo account: <strong>{email}</strong>
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                                        Click "Sign In" to continue with demo credentials
                                    </Typography>
                                </Alert>
                            </motion.div>
                        )}

                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{" "}
                                <Button
                                    variant="text"
                                    onClick={() => router.push("/register")}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        color: "#667eea",
                                        "&:hover": {
                                            color: "#5a6fd8",
                                        },
                                    }}
                                >
                                    Create Account
                                </Button>
                            </Typography>
                        </Box>

                        {/* Security Notice */}
                        <Alert
                            severity="info"
                            icon={false}
                            sx={{
                                mt: 3,
                                fontSize: 12,
                                borderRadius: 2,
                                backgroundColor: "rgba(102, 126, 234, 0.05)",
                                "& .MuiAlert-message": { width: "100%" },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#667eea",
                                    }}
                                />
                                <Typography variant="caption">
                                    Demo accounts are for testing purposes only
                                </Typography>
                            </Box>
                        </Alert>

                        {/* Demo Account Details */}
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                                border: "1px dashed rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                Demo Account Details:
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Chip label="Admin" size="small" sx={{ bgcolor: "#10b98110", color: "#10b981" }} />
                                    <Typography variant="caption">admin@demo.com / Admin@123</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Chip label="User" size="small" sx={{ bgcolor: "#3b82f610", color: "#3b82f6" }} />
                                    <Typography variant="caption">user@demo.com / User@123</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}

// Main Component with Suspense
export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            width: 400,
                            textAlign: "center",
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <CircularProgress size={60} sx={{ color: "#667eea" }} />
                        <Typography variant="h6" sx={{ mt: 3, color: "#667eea" }}>
                            Loading Security...
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                            Please wait while we verify your access
                        </Typography>
                    </Paper>
                </Box>
            }
        >
            <LoginForm />
        </Suspense>
    );
}