
'use client'
import React, { useState } from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { UserCheck, CreditCard, Sparkles, Clock, Layout } from 'lucide-react';

interface StepItem {
    title: string;
    desc: string;
    icon: React.ReactNode;
}

const steps: StepItem[] = [
    { title: 'Appoint Secretary', desc: 'Choose a certified secretary.', icon: <UserCheck size={18} /> },
    { title: 'Payment', desc: 'Secure checkout.', icon: <CreditCard size={18} /> },
    { title: 'Begin Incorporation', desc: 'Secretary initiates SSM process.', icon: <Sparkles size={18} /> },
    { title: '3-5 Business Days', desc: 'Ready to go live.', icon: <Clock size={18} /> },
    { title: 'Manage Dashboard', desc: 'Access statutory records.', icon: <Layout size={18} /> }
];

interface MinimalStepProps {
    step: StepItem;
    index: number;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
}

const MinimalStep = ({ step, index, hoveredIndex, setHoveredIndex }: MinimalStepProps) => {
    const isHovered = hoveredIndex === index;

    return (
        <Box
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            sx={{ flex: 1, position: 'relative', cursor: 'default', px: 2 }}
        >
            <motion.div
                animate={{
                    y: isHovered ? -8 : 0,
                    opacity: hoveredIndex === null || isHovered ? 1 : 0.4
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Stack spacing={2} alignItems="flex-start">
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            bgcolor: isHovered ? '#000' : '#f4f4f5',
                            color: isHovered ? '#fff' : '#71717a',
                            transition: 'all 0.3s ease',
                            border: '1px solid',
                            borderColor: isHovered ? '#000' : '#e4e4e7',
                        }}
                    >
                        {step.icon}
                    </Box>

                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#18181b', mb: 0.5 }}>
                            {step.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#71717a', display: 'block', lineHeight: 1.4 }}>
                            {step.desc}
                        </Typography>
                    </Box>
                </Stack>
            </motion.div>
        </Box>
    );
};

export default function AnycompMinimalFlow() {
    // FIX: Explicitly type the state to allow number or null
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <Box sx={{ py: 15, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Box mb={10}>
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1 }}>
                        Get started with Anycomp
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#71717a' }}>
                        Incorporation in five simple, automated steps.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 40,
                            right: 40,
                            height: '1px',
                            bgcolor: '#e4e4e7',
                            zIndex: 0,
                            display: { xs: 'none', md: 'block' }, // Hide line on mobile for better layout
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: '100%',
                                background: 'linear-gradient(90deg, transparent, #000, transparent)',
                                animation: 'pulse 4s infinite linear',
                            },
                            '@keyframes pulse': {
                                '0%': { transform: 'translateX(-100%)' },
                                '100%': { transform: 'translateX(100%)' }
                            }
                        }}
                    />

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 6, md: 0 }}
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        {steps.map((step, index) => (
                            <MinimalStep
                                key={index}
                                index={index}
                                step={step}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                            />
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}