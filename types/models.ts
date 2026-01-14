import { Role } from "@prisma/client";

// User type with role information
export interface UserWithRole {
    id: number;
    email: string;
    name: string | null;
    role: Role;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Post type with author information
export interface PostWithAuthor {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string | null;
    title_th: string | null;
    content_th: string | null;
    excerpt_th: string | null;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    metaTitle_th: string | null;
    metaDescription_th: string | null;
    metaKeywords_th: string | null;
    author: {
        name: string | null;
    };
}

// Demo Request type
export interface DemoRequest {
    id: string;
    workEmail: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
    country: string;
    interest: string;
    status: string;
    createdAt: Date;
}
