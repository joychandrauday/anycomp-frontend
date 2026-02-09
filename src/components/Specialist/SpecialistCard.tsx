'use client'
import React from 'react';
import Image from 'next/image';
import { Specialist } from '@/types/specialists';
import Link from 'next/link';

interface SpecialistCardProps {
    data: Specialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ data }) => {
    // Handle missing media
    const bannerImage = data?.media?.[0]?.cloudinary_url ||
        'https://res.cloudinary.com/dklikxmpm/image/upload/v1770313284/secretaries/banners/ql3n3d17sznhc5lvbbwr.jpg';

    // Handle missing user data
    const userName = data?.assigned_secretary?.full_name || 'Unknown Secretary';
    const userInitial = userName?.charAt(0) || 'S';
    const profileImage = data?.assigned_secretary?.profile_image;
    const description = data?.description || 'No description available.';
    const title = data?.title || 'No description available.';
    const price = data?.final_price ? Number(data.final_price).toFixed(2) : '0.00';

    return (
        <Link
            href={`/service/${data.slug}`}
            className="group bg-white rounded-sm shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden flex flex-col h-full"
        >
            {/* Banner */}
            <div
                className="h-40 w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bannerImage})`
                }}
            />

            {/* Content */}
            <div className="p-4 flex-1">
                <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0 overflow-hidden">
                        {profileImage ? (
                            <Image
                                src={profileImage}
                                alt={userName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            userInitial
                        )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start flex-col">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                {userName}
                            </h3>
                            <span className="text-xs text-gray-500 capitalize font-light mt-0.5">
                                Company secretary
                            </span>
                        </div>
                    </div>
                </div>

                {/* title */}
                <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {title}
                </p>
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {description}
                </p>

                {/* Additional Info (if available) */}
                {data?.expertise_areas && data.expertise_areas.length > 0 && (
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                            {data.expertise_areas.slice(0, 2).map((area: string, index: number) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {area}
                                </span>
                            ))}
                            {data.expertise_areas.length > 2 && (
                                <span className="text-xs text-gray-500">
                                    +{data.expertise_areas.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Price and Action */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-lg font-bold text-gray-900">
                            RM {price}
                        </div>
                        <div className="text-xs text-gray-500">
                            {data?.duration_days || 'N/A'} days
                        </div>
                    </div>
                    <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                        View Details →
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default SpecialistCard;