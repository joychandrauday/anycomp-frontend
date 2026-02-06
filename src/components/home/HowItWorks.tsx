"use client";
import { motion, Variants } from "framer-motion";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DocumentScannerOutlined } from "@mui/icons-material";

const steps = [
    {
        stepNum: "01",
        title: "Appoint a Company Secretary",
        description:
            "Connect with a licensed Company Secretary on our platform to register your company.",
        icon: <PersonAddIcon style={{ fontSize: 32, color: "#ffffff" }} />,
    },
    {
        stepNum: "02",
        title: "Register Your Company",
        description:
            "Your appointed Secretary will handle the registration process with SSM, ensuring everything is compliant.",
        icon: <AppRegistrationIcon style={{ fontSize: 32, color: "#ffffff" }} />,
    },
    {
        stepNum: "03",
        title: "eSignature",
        description:
            "Review and sign all statutory documents electronically via our secure e-signature integration.",
        icon: <AssignmentTurnedInIcon style={{ fontSize: 32, color: "#ffffff" }} />,
    },
    {
        stepNum: "04",
        title: "Documents & Files",
        description:
            "Securely upload, store, and manage all your company documents.",
        icon: <DocumentScannerOutlined style={{ fontSize: 32, color: "#ffffff" }} />,
    },
];
const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 50
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut" // TS now accepts this because of the Variants type
        },
    }),
};

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-[#00204E] flex items-center">
            <div className="container mx-auto py-12 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                    How it works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="bg-transparent text-white rounded-xl p-6 flex flex-col shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2"
                        >
                            {/* Icon */}
                            <div className="wrap flex gap-4 items-center">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#002F70] mb-4 text-white">
                                    {step.icon}
                                </div>
                                {/* Title */}
                                <h3 className="text-xl font-bold mb-2 text-[#4995FF]">{step.title}</h3>
                            </div>


                            {/* Description */}
                            <p className="text-white">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
