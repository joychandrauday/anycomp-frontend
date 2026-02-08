// components/Specialist/ServiceDetails.tsx
"use client";

import { Specialist } from "@/types/specialists";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Clock,
    Users,
    Tag,
    Calendar,
    ArrowLeft,
    Star,
    Package,
    FileText,
    BadgeCheck,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

// export interface ServiceData {
//     id: string;
//     slug: string;
//     title: string;
//     description: string;
//     base_price: string;
//     platform_fee: string;
//     average_rating: string;
//     total_number_of_ratings: number;
//     is_draft: boolean;
//     verification_status: string;
//     is_verified: boolean;
//     specialist_status: string;
//     total_projects_completed: number;
//     duration_days: number;
//     created_at: string;
//     updated_at: string;

// }

interface ServiceDetailsProps {
    service: Specialist;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12"
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to services
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    {service.is_verified && (
                                        <BadgeCheck className="text-emerald-300" size={20} />
                                    )}
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                        {service.specialist_status === 'available' ? 'Available Now' : 'By Appointment'}
                                    </span>
                                </div>

                                <h1 className="text-2xl md:text-4xl font-bold mb-3">
                                    {service.title}
                                </h1>

                                <p className="text-lg text-blue-100">
                                    {service.description}
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 w-full md:w-auto">
                                <div className="mb-3">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl md:text-3xl font-bold">RM{service.base_price}</span>
                                        <span className="text-blue-200 text-sm">one-time</span>
                                    </div>
                                    <p className="text-xs text-blue-200 mt-1">Platform fee: RM{service.platform_fee}</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Book This Service
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Key Features */}
                            <div className="bg-white rounded-xl p-4 shadow">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="text-blue-600" />
                                    What&apos;s Included
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                        <CheckCircle className="text-green-500 mt-1" size={18} />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Complete Package</h3>
                                            <p className="text-gray-600 text-sm">Full statutory kit with company seal</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                        <FileText className="text-blue-500 mt-1" size={18} />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Legal Documents</h3>
                                            <p className="text-gray-600 text-sm">All required legal documents included</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Stats */}
                            <div className="bg-white rounded-xl p-4 shadow">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Service Stats</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <Clock className="text-blue-600 mx-auto mb-2" size={20} />
                                        <div className="text-lg font-bold">{service.duration_days}</div>
                                        <div className="text-gray-600 text-sm">Days</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <Users className="text-green-600 mx-auto mb-2" size={20} />
                                        <div className="text-lg font-bold">{service.total_projects_completed}</div>
                                        <div className="text-gray-600 text-sm">Completed</div>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <Star className="text-amber-600 mx-auto mb-2" size={20} />
                                        <div className="text-lg font-bold">{service.average_rating}</div>
                                        <div className="text-gray-600 text-sm">Rating</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <TrendingUp className="text-purple-600 mx-auto mb-2" size={20} />
                                        <div className="text-lg font-bold">100%</div>
                                        <div className="text-gray-600 text-sm">Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Status */}
                            <div className="bg-white rounded-xl p-4 shadow">
                                <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Verification</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${service.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {service.verification_status === 'verified' ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Published</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${service.is_draft ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {service.is_draft ? 'No' : 'Yes'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-xl p-4 shadow">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Calendar className="text-blue-600" size={18} />
                                    Timeline
                                </h3>
                                <div className="relative pl-4">
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div key={step} className="relative mb-3 last:mb-0">
                                            <div className={`absolute -left-4 top-1 w-2 h-2 rounded-full ${step <= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                            <div className="ml-2">
                                                <h4 className="font-medium text-gray-800 text-sm">Step {step}</h4>
                                                <p className="text-xs text-gray-600">
                                                    {step === 1 && 'Submit requirements'}
                                                    {step === 2 && 'Document prep'}
                                                    {step === 3 && 'Seal manufacturing'}
                                                    {step === 4 && 'Quality check'}
                                                    {step === 5 && 'Delivery'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-4 right-4 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
                >
                    <Tag size={18} />
                    Book Now
                </motion.button>
            </div>
        </div>
    );
}