"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
    palette: {
        primary: {
            main: "#00204E",
        },
        secondary: {
            main: "#000000",
        },
        text: {
            primary: "#222222",
            secondary: "#FFFFFF",
        },
    },
    typography: {
        // Red Hat Display as primary, Proxima Nova as fallback
        fontFamily: [
            '"Red Hat Display"',
            '"Proxima Nova"',
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 700, color: "#222222" },
        h2: { fontWeight: 700, color: "#222222" },
        body1: { color: "#222222" },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px", // Clean, modern look
                    padding: "8px 20px",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#222222", // Ensures all Typography defaults to your color
                },
            },
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider>
                <CssBaseline />
                {children}
            </SessionProvider>
        </ThemeProvider>
    );
}