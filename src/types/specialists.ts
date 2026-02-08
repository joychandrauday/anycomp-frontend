/* eslint-disable @typescript-eslint/no-explicit-any */
// types/specialist.ts
export interface Specialist {
    banner: string;
    media: any[];
    image_3: unknown;
    image_2: unknown;
    image_1: unknown;
    id: string;
    title: string;
    slug: string;
    base_price: string;
    average_rating: string;
    verification_status: string;
    is_draft: boolean;
    created_at: string;
    assigned_secretary_id?: string;
    description?: string;
    duration_days?: number;
    additional_offerings?: string[];
    user: any;
    final_price: string;
    assigned_secretary: {
        id: string;
        full_name: string;
        profile_image?: string;
        companyName: string;
        registration_number: string;
        experience: any;
        areas_of_expertise: any;
    };
    expertise_areas: any;
    specialist_status: string;
    total_projects_completed: number;
    platform_fee: string;
    is_verified: boolean;

}