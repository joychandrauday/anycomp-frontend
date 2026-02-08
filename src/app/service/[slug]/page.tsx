// app/service/[slug]/page.tsx

import ServiceDetails from "@/components/Specialist/ServiceDetails";
import { specialistService } from "@/services/specialistService";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function ServicePage({ params }: PageProps) {
    const { slug } = await params;
    const service = await specialistService.getBySlug(slug)
    console.log(service.data);

    return (
        <div>
            <ServiceDetails service={service.data} />
        </div>
    );
}
