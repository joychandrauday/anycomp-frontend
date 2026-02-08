'use client'
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/GridLegacy";
import Link from 'next/link';

export default function FAQSection() {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        { q: "What is Anycomp?", a: "Anycomp is a platform that connects users with licensed company secretaries to help with company incorporation and compliance requirements." },
        { q: "What is a Company Secretary and why do I need one?", a: "A Company Secretary is a professional responsible for ensuring your company meets statutory and regulatory requirements; required for legal compliance." },
        { q: "What is SSM?", a: "SSM refers to the Suruhanjaya Syarikat Malaysia (Companies Commission of Malaysia) — the regulator of companies and businesses in Malaysia." },
        { q: "How do I Register my Company?", a: "You select a certified Company Secretary, provide your details, and they handle the registration process with SSM on your behalf." },
        { q: "How much does it cost to use Anycomp?", a: "The cost varies depending on services selected (e.g., incorporation, subscription packages). Check pricing on the dashboard or pricing page." },
        { q: "Who can use Anycomp — individuals, businesses, or foreigners?", a: "Anycomp is available to individuals, business owners, and foreigners who meet incorporation eligibility criteria set by SSM." },
        { q: "Can I register more than one Company on Anycomp?", a: "Yes — you can register multiple companies with separate signups or packages." },
        { q: "How long does the company registration process take?", a: "Company registration generally takes 3–5 business days, depending on document completeness and SSM processing times." },
        { q: "What is the Company Dashboard and what information does it show?", a: "The Company Dashboard gives an overview of company profile, documents, compliance reminders, updates, and status tracking features." },
    ];

    return (
        <Box sx={{ py: 8, px: { xs: 2, md: 6 } }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="start">
                    {/* Left Side: Banner Image */}
                    <Grid item xs={12} md={5}>
                        <Box
                            component="img"
                            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                            alt="FAQ Support"
                            sx={{
                                width: '100%',
                                borderRadius: 4,
                                boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
                                display: { xs: 'none', md: 'block' }
                            }}
                        />
                    </Grid>

                    {/* Right Side: Accordions */}
                    <Grid item xs={12} md={7}>
                        {faqs.map((item, idx) => (
                            <Accordion
                                key={idx}
                                disableGutters
                                elevation={0}
                                expanded={expanded === `panel${idx}`}
                                onChange={handleChange(`panel${idx}`)}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:before': { display: 'none' },
                                    mb: 1
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    sx={{ px: 0 }}
                                >
                                    <Typography fontWeight={600} variant="body1">
                                        {item.q}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 0, pb: 3 }}>
                                    <Typography color="text.primary" lineHeight={1.7}>
                                        {item.a}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
            </Container>

            <div className="text-center mb-10 bg-[#00204E] w-6xl mx-auto mt-16 rounded text-white p-4 min-h-48 flex items-center justify-center gap-5">
                <div className="wrap">
                    <h2 className="text-3xl font-bold mb-7">Register Your Company</h2>
                    <Link href={'/register'} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Get Started
                    </Link>
                </div>
            </div>
        </Box>
    );
}
