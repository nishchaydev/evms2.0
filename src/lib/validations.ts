import { z } from 'zod';

export const ReportSchema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
    category: z.enum(['Road Maintenance', 'Street Lighting', 'Garbage Collection', 'Water Supply', 'Drainage / Sewage', 'Public Safety / Hazards', 'Stray Animals', 'Illegal Encroachment', 'Other']),
    location: z.string().min(5, "Location is required"),
    department: z.string().optional().nullable(),
    employeeId: z.string().optional().nullable(),
});

export const LoginSchema = z.object({
    role: z.enum(['super-admin', 'admin', 'officer']),
    userId: z.string().min(3, "User ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});
