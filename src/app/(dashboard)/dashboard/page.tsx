// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "../_components/AdminDashboard";
import UserDashboard from "../_components/UserDashboard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    switch (session.user.role) {
        case "super_admin":
            return <AdminDashboard />;
        case "viewer":
            return <UserDashboard />;
        default:
            return <div>Unauthorized</div>;
    }
}
