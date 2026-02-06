// app/dashboard/_components/AdminDashboard.tsx
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";


export default function AdminDashboard() {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h3">1,245</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Active Sessions</Typography>
                            <Typography variant="h3">87</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">System Health</Typography>
                            <Typography variant="h3" color="success.main">
                                OK
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Admin Actions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Use the sidebar to manage users, roles, and system settings.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
