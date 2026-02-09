// services/companyService.ts
import { apiFetch } from "@/lib/api";
import { Specialist } from "@/types/specialists";


interface specialistResponse {
    data: Specialist[];
    total: number;
}
interface SingleSpecialistResponse {
    data: Specialist;
    total: number;
}
interface SearchSpecialistResponse {
    data: {
        data: Specialist[]
    };
    total: number;
}

export const specialistService = {
    getAll: () => apiFetch<specialistResponse>("/specialists"),
    getAllSecretary: () => apiFetch<specialistResponse>("/specialists/secretary/my"),
    searchService: (q: string) => apiFetch<SearchSpecialistResponse>(`/specialists/service/search?q=${q}`),
    getAllAdmin: () => apiFetch<specialistResponse>("/specialists/admin"),

    getBySlug: (slug: string) => apiFetch<SingleSpecialistResponse>(`/specialists/${slug}`, {
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