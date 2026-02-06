import { specialistService } from "@/services/specialistService";
import {
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";


type Service = {
    id: number;
    title: string;
    body: string;
};




export default async function Services() {
    const specialists = await specialistService.getAll();
    // console.log(specialists);
    return (
        <Container sx={{ py: 12 }}>
            <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                gutterBottom
            >
                Our Services
            </Typography>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                {/* {servicspecialistses.map((service) => (
                    <Grid key={service.id} size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    {service.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {service.body}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))} */}
            </Grid>
        </Container>
    );
}
