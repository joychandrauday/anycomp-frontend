import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box borderTop={1} borderColor="divider" py={4}>
            <Container>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                >
                    © {new Date().getFullYear()} AnyComp. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
