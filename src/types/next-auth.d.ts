import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            permissions: string[];
        } & DefaultSession["user"];
        accessToken: string;
    }

    interface User {
        id: string;
        role: string;
        permissions: string[];
        accessToken: string;
        accessTokenExpires: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: string;
        permissions: string[];
        accessToken: string;
        accessTokenExpires: number;
        error?: string;
    }
}
