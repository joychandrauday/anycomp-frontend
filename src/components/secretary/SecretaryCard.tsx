'use client'
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    Stack
} from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import { ISecretary } from '@/types';

// Define the interface for your props
interface SecretaryCardProps {
    data: ISecretary;
}

const SecretaryCard: React.FC<SecretaryCardProps> = ({ data }) => {
    return (
        <Card
            sx={{
                width: '100%',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Box
                    sx={{
                        width: '100%',
                        height: 120,
                        backgroundImage: `url(${data?.banner || 'https://via.placeholder.com/400x120?text=No+Banner'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '4px 4px 0 0',
                        mb: 2
                    }}
                />
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem'
                        }}
                    >
                        {data?.user?.full_name ? data.user.full_name.charAt(0) : 'S'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                            {data?.user?.full_name || data?.user?.full_name || 'Unknown Secretary'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VerifiedUser sx={{ fontSize: 14, color: 'success.main' }} /> {data?.certifications?.length || 0} Certifications
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Select Secretary
                </Button>
            </Box>
        </Card>
    );
};

export default SecretaryCard;