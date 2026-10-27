import { z } from "zod";
export const contactRequestSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  contactType: z.enum(["email", "phone", "sms"]),
  contact: z.string().trim().min(1, "Enter your contact details."),
  message: z.string().trim().min(1, "Tell us a little about your project."),
}).superRefine(({ contactType, contact }, ctx) => {
  if (!contact) return;
  if (contactType === "email") {
    if (!z.email().safeParse(contact).success) {
      ctx.addIssue({ code: "custom", path: ["contact"], message: "Enter a valid email address." });
    }
  } else {
    const digits = contact.replace(/\D/g, "");
    if (!/^\+?[\d\s().-]+$/.test(contact) || digits.length < 7 || digits.length > 15) {
      ctx.addIssue({ code: "custom", path: ["contact"], message: "Enter a valid phone number, including the area code." });
    }
  }
});
export type ContactType = z.infer<typeof contactRequestSchema>["contactType"];
export type ContactResponse = { success: boolean; message: string; issues?: z.ZodIssue[] };
