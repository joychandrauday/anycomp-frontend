/* eslint-disable @typescript-eslint/no-explicit-any */
// types/specialist.ts
export interface Specialist {
    media: any;
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
}