import { specialistService } from "@/services/specialistService";
import { Specialist } from "@/types/specialists";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";
import { Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


type Service = {
    id: number;
    title: string;
    body: string;
};




export default async function Services() {
    const specialists = await specialistService.getAll();
    console.log(specialists, 'hello');
    return (
        <Container sx={{ py: 12 }}>
            <Box textAlign="start" mb={2}>
                <Typography
                    variant="subtitle1"
                    sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, mb: 1 }}
                >
                    Certified Experts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Appoint a Company Secretary
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', maxWidth: 600, }}>
                    Your secretary handles all details and documents to ensure a smooth and compliant SSM registration.
                </Typography>
            </Box>


            <div className="secretary-grid mt-8 w-full">
                <div className="grid grid-cols-2 gap-4">

                    {specialists.data.map((specialist: Specialist) => (
                        <div key={specialist.id} className="border rounded-lg p-4">
                            <div className="secretary-details flex justify-between items-center">
                                <div className="flex gap-2 items-start ">
                                    {specialist.assigned_secretary?.profile_image ? (
                                        <Image
                                            src={specialist.assigned_secretary.profile_image}
                                            alt="Secretary Profile"
                                            className="w-12 h-12 rounded-full object-cover"
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                            <Typography variant="h6" sx={{ color: 'white' }}>
                                                {specialist.assigned_secretary?.full_name ? specialist.assigned_secretary.full_name.charAt(0) : "CS"}
                                            </Typography>
                                        </div>
                                    )}
                                    <div className="secretary-info">
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px' }} className="flex">
                                            {specialist.assigned_secretary?.full_name || "Company Secretary"}
                                            {specialist.verification_status === "verified" && (
                                                <span style={{ color: 'green', marginLeft: 8 }} title="Verified Specialist" className="flex items-center justify-center gap-1 font-medium">
                                                    <ShieldCheck /> Verified
                                                </span>
                                            )}
                                        </Typography>
                                        <p className="text-sm text-gray-500">
                                            {specialist.assigned_secretary?.companyName || "ST Comp Holdings"}
                                        </p>
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="flex flex-col items-start gap-1 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Shield size={16} />
                                            <span className="text-xs text-gray-500">License: {specialist.assigned_secretary?.registration_number || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield size={16} />
                                            <span className="text-xs text-gray-500">Experience: {specialist.assigned_secretary?.experience || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield size={16} />
                                            <span className="text-xs text-gray-500">Expertise: {specialist.assigned_secretary?.areas_of_expertise?.join(", ") || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="specialist-data my-6">
                                <div className="flex gap-2">
                                    <div className="media w-2/5">
                                        <Image
                                            src={
                                                specialist?.media?.[0]?.cloudinary_url ??
                                                "https://res.cloudinary.com/dklikxmpm/image/upload/v1770365352/media/zyltbul3onchp3atdl7z.jpg"
                                            }
                                            alt="Service media"
                                            className="w-52 h-32 rounded-lg object-cover"
                                            width={120}
                                            height={120}
                                        />
                                    </div>
                                    <div className="media w-3/5">
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {specialist?.title || "Company Specialist"}
                                        </Typography>
                                        <ol className="list-decimal list-inside pl-4 block">
                                            {specialist?.additional_offerings?.slice(0, 4).map((offering, index) => (
                                                <li key={index} className="truncate">
                                                    {offering}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Visit Profile Button */}
                            <Link
                                className="mt-12 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
                                href={`/secretary/${specialist.assigned_secretary?.id}`}
                            >
                                Visit Profile
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </Container >
    );
}
