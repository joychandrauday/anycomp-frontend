// app/secretaries/page.tsx
import { secretaryService } from "@/services/secretaryService";
import SecretaryTable from "../../_components/SecretaryTable";
import { ISecretary } from "@/types";


export default async function SecretariesPage() {
    try {
        const response = await secretaryService.getAll();
        const secretaries: ISecretary[] = response.data || [];

        return <SecretaryTable initialSecretaries={secretaries} />;
    } catch (error) {
        console.error("Failed to fetch secretaries:", error);
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-900">Secretaries</h1>
                <p className="text-red-500 mt-4">Failed to load secretaries. Please try again later.</p>
            </div>
        );
    }
}