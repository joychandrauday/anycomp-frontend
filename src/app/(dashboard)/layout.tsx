'use client';

import DashboardLayout from "./_components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function RootDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();

    if (status === "loading") return null;

    if (!session?.user) return null;

    return (
        <DashboardLayout user={session.user}>
            {children}
        </DashboardLayout>
    );
}
