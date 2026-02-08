/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { UserCheck, CreditCard, Sparkles, Clock, LayoutDashboard } from 'lucide-react';
import { Specialist } from '@/types/specialists';
import SpecialistCard from '../Specialist/SpecialistCard';

const steps = [
    { title: 'Appoint Secretary', desc: 'Appoint Your Company Secretary', icon: <UserCheck size={20} /> },
    { title: 'Payment', desc: 'Proceed to secure checkout', icon: <CreditCard size={20} /> },
    { title: 'Begin Incorporation', desc: 'Secretary initiates SSM process', icon: <Sparkles size={20} /> },
    { title: '3-5 Business Days', desc: 'Ready for official operations', icon: <Clock size={20} /> },
    { title: 'Manage Dashboard', desc: 'Access all statutory records', icon: <LayoutDashboard size={20} /> }
];

const InteractiveStep = ({ step, index, hoveredIndex, setHoveredIndex }: any) => {
    const isHovered = hoveredIndex === index;
    const isAnyHovered = hoveredIndex !== null;

    return (
        <Box
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            sx={{ flex: 1, position: 'relative', px: 2, cursor: 'pointer' }}
        >
            <motion.div
                animate={{
                    y: isHovered ? -12 : 0,
                    opacity: isAnyHovered && !isHovered ? 0.3 : 1,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className='group'
            >
                <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
                    {/* Icon Node */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            bgcolor: isHovered ? 'primary.main' : '#f8fafc',
                            color: isHovered ? '#fff' : '#d2d2d2',
                            border: '1px solid',
                            borderColor: isHovered ? 'primary.main' : '#e2e8f0',
                            transition: 'background-color 0.3s, color 0.3s',
                            boxShadow: isHovered ? '0 10px 20px rgba(25, 118, 210, 0.2)' : 'none'
                        }}
                    >
                        {step.icon}
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                            {step.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#d2d2d2', display: 'block', lineHeight: 1.5, maxWidth: 180 }} className='group-hover:text-[#000000]'>
                            {step.desc}
                        </Typography>
                    </Box>
                </Stack>
            </motion.div>
        </Box >
    );
};

const GetStartedSection = ({ data }: any) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box textAlign="start" mb={2}>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, mb: 1 }}
                    >
                        Get started with Anycomp
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Register a New Company
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', maxWidth: 600, }}>
                        Launch Your Company with Certified and Trusted Company Secretaries.
                    </Typography>
                </Box>

                {/* Timeline Container */}
                <Box sx={{ position: 'relative' }}>
                    {/* Animated Background Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 24,
                            left: '5%',
                            right: '5%',
                            height: '1px',
                            bgcolor: '#e2e8f0',
                            display: { xs: 'none', md: 'block' },
                            zIndex: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                background: 'linear-gradient(90deg, transparent, #1976d2, transparent)',
                            }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    </Box>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 8, md: 0 }}
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        {steps.map((step, index) => (
                            <InteractiveStep
                                key={index}
                                index={index}
                                step={step}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                            />
                        ))}
                    </Stack>
                </Box>

            </Container >
            {/* Cards Grid - FIXED */}
            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data?.map((specialist: Specialist) => (
                        <div key={specialist.slug} className="h-full">
                            <SpecialistCard data={specialist} />
                        </div>
                    ))}
                </div>
            </Container>
        </Box >
    );
};

export default GetStartedSection;