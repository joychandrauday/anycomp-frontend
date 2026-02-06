// app/dashboard/users/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "super_admin") {
        redirect("/dashboard");
    }

    return <div>User management</div>;
}
