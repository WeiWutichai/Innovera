
import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: Role;
            isApproved: boolean;
            canReportIssues: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        role: Role;
        isApproved: boolean;
        canReportIssues: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role: Role;
        isApproved: boolean;
        canReportIssues: boolean;
    }
}
