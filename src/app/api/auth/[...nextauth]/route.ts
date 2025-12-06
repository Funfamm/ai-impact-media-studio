// NextAuth configuration for admin authentication
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Bridge for Firebase Client Auth
                // CAUTION: This trusts the client to have verified the password with Firebase.
                // In a production environment with Admin SDK, we would verify the ID Token here.
                if (credentials?.password === "FIREBASE_SESSION_VERIFIED_BY_CLIENT") {
                    return {
                        id: "firebase-user",
                        name: "Admin User",
                        email: credentials.username || "admin@impactaistudio.com"
                    };
                }

                // Legacy/Fallback Mock
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return { id: "admin", name: "Admin", email: process.env.CONTACT_EMAIL || "admin@impactaistudio.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                // @ts-ignore – assign id dynamically
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
