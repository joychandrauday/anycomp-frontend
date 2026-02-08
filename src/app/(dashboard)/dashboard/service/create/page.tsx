import CreateSpecialistForm from '@/components/Specialist/CreateSpecialistForm';
import { secretaryService } from '@/services/secretaryService';
import React from 'react';

const Page = async () => {

    const secretaries = await secretaryService.getAll()
    return (
        <div>
            <CreateSpecialistForm
                secretaries={secretaries.data || []}
            />
        </div>
    );
}

export default Page;
