// services/companyService.ts
import { apiFetch } from "@/lib/api";
import { ISecretary } from "@/types";

export interface Company {
    id: string;
    name: string;
    status: string;
}
interface secretaryResponse {
    data: ISecretary[];
    total: number;
}

export const secretaryService = {
    getAll: () => apiFetch<secretaryResponse>("/secretaries"),

    getById: (id: string) => apiFetch<ISecretary>(`/secretaries/${id}`, {
        next: { revalidate: 60 } // Specific override for this call
    }),

    create: (data: Partial<Company>) => apiFetch<Company>("/secretaries", {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store", // Don't cache POST requests
    }),
};