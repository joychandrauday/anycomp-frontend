import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

const BACKEND_URL = process.env.BACKEND_URL!;
console.log(BACKEND_URL)
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    const res = await fetch(`${BACKEND_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const text = await res.text();
                    console.log("LOGIN STATUS:", res.status);
                    console.log("LOGIN RESPONSE:", text);

                    if (!res.ok) return null;

                    const json = JSON.parse(text);
                    const { user, access_token, expires_in } = json.data;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.full_name,
                        role: user.role,
                        permissions: user.permissions,
                        accessToken: access_token,
                        accessTokenExpires: Date.now() + expires_in * 1000,
                    };
                } catch (err) {
                    console.error("AUTHORIZE ERROR:", err);
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            // First login
            if (user) {
                return {
                    ...token,
                    ...user,
                };
            }

            // Token still valid
            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires
            ) {
                return token;
            }

            // Token expired → refresh
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.role = token.role;
                session.user.permissions = token.permissions;
            }

            session.accessToken = token.accessToken as string;

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const text = await res.text();
        console.log("REFRESH STATUS:", res.status);
        console.log("REFRESH RESPONSE:", text);

        if (!res.ok) {
            throw new Error("Failed to refresh token");
        }

        const json = JSON.parse(text);
        const { user, access_token, expires_in } = json.data;

        return {
            ...token,
            accessToken: access_token,
            accessTokenExpires: Date.now() + expires_in * 1000,
            role: user.role,
            permissions: user.permissions,
        };
    } catch (error) {
        console.error("REFRESH ERROR:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
