// services/companyService.ts
import { apiFetch } from "@/lib/api";

export interface Company {
    id: string;
    name: string;
    status: string;
}
interface secretaryResponse {
    data: Company[];
    total: number;
}

export const secretaryService = {
    getAll: () => apiFetch<secretaryResponse>("/secretaries"),

    getById: (id: string) => apiFetch<Company>(`/secretaries/${id}`, {
        next: { revalidate: 60 } // Specific override for this call
    }),

    create: (data: Partial<Company>) => apiFetch<Company>("/secretaries", {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store", // Don't cache POST requests
    }),
};