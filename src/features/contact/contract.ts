import { z } from "zod";
export const contactRequestSchema = z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().optional(), message: z.string().min(1) });
export type ContactResponse = { success: boolean; message: string; issues?: z.ZodIssue[] };
