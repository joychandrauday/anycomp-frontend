// app/dashboard/_components/UserDashboard.tsx
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";

export default function UserDashboard() {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Welcome Back 👋
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">My Account</Typography>
                            <Typography variant="body2" color="text.secondary">
                                View and update your profile information.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Activity</Typography>
                            <Typography variant="body2" color="text.secondary">
                                You have no new notifications.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Getting Started</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Use the menu to navigate through your dashboard features.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
