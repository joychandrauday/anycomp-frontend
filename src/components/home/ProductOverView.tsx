import { Box, Container, Typography } from '@mui/material';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const ProductOverView = () => {
    return (
        <div>
            <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
                <Container maxWidth="lg">

                    <Box textAlign="start" mb={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, mb: 1 }}
                        >
                            Seamless Incorporation & Compliance
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Manage your Company
                        </Typography>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                </span>
                                <p>Company Dashboard to give you an overview of your company’s key information and activities</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                </span>
                                <p>Documents & Files provides a secure place to store and manage important company records</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                </span>
                                <p>eSignature lets you digitally sign documents requested by your Company Secretary</p>
                            </div>
                        </div>
                    </Box>
                    <div
                        className="wrap min-h-[80vh] bg-center bg-no-repeat bg-contain"
                        style={{ backgroundImage: "url('/dashboardoverview.png')" }}
                    >
                    </div>

                </Container>
            </Box>
        </div>
    );
}

export default ProductOverView;
