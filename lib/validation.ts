import { z } from "zod";

// Demo Request Validation Schema
export const demoRequestSchema = z.object({
    workEmail: z.string().email("Invalid email format"),
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    phoneNumber: z.string().optional(),
    companyName: z.string().min(1, "Company name is required").max(200),
    country: z.string().optional(),
    interest: z.string().optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

// User Registration Validation Schema
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
    name: z.string().min(1, "Name is required").max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
