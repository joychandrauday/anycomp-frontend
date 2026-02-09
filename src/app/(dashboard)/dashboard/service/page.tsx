import { specialistService } from "@/services/specialistService";
import SpecialistTable from "../../_components/SpecialistTable";
import { secretaryService } from "@/services/secretaryService";

export default async function SpecialistsPage() {
    const response = await specialistService.getAllAdmin();
    const secretaryResponse = await secretaryService.getAll();
    const specialists = response.data || [];
    const secretaries = secretaryResponse.data || [];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="w">
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <h1 className="text-sm  text-gray-500">Create and publish your services for Client’s & Companies</h1>
                </div>

            </div>

            <SpecialistTable initialData={specialists} secretaries={secretaries} />
        </div>
    );
}