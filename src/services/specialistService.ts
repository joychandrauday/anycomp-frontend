// services/companyService.ts
import { apiFetch } from "@/lib/api";
import { Specialist } from "@/types/specialists";


interface specialistResponse {
    data: Specialist[];
    total: number;
}

export const specialistService = {
    getAll: () => apiFetch<specialistResponse>("/specialists"),
    getAllAdmin: () => apiFetch<specialistResponse>("/specialists/admin"),

    getById: (id: string) => apiFetch<Specialist>(`/specialists/${id}`, {
        next: { revalidate: 60 } // Specific override for this call
    }),

    create: (data: Partial<Specialist>) => apiFetch<Specialist>("/specialists", {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store", // Don't cache POST requests
    }),
    // Added Update Method
    update: (id: string | number, data: Partial<Specialist>) => apiFetch<Specialist>(`/specialists/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        cache: "no-store",
    }),
};