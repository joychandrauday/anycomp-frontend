// lib/api.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path

export const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}) {
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

    // 1. Get the session (on the server)
    const session = await getServerSession(authOptions);
    const token = session?.accessToken; // The name depends on your NextAuth config
    // console.log(session);
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    // 2. Automatically inject Bearer token if it exists
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized logic (e.g., redirect to login)
    }

    return response.json() as Promise<T>;
}