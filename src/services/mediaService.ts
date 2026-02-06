// services/companyService.ts
import { apiFetch } from "@/lib/api";



export const mediaService = {
    // getAll: () => apiFetch<Company[]>("/secretaries"),

    // getById: (id: string) => apiFetch<Company>(`/secretaries/${id}`, {
    //     next: { revalidate: 60 } // Specific override for this call
    // }),

    create: (data: any) => {
        const isFormData = data instanceof FormData;

        return apiFetch<any>("/media", {
            method: "POST",
            body: isFormData ? data : JSON.stringify(data),
            cache: "no-store",
            headers: isFormData
                ? undefined
                : {
                    "Content-Type": "application/json",
                },
        });
    },

};