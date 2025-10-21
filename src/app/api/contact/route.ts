/* Short title: Contact API route with validation and errors */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	message: z.string().min(1),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = schema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ success: false, message: "Invalid input", issues: parsed.error.issues }, { status: 400 });
		}
		// Short title: Simulated processing; later integrate email/CRM
		if (process.env.NODE_ENV !== "production") {
			console.log("[contact:request]", parsed.data);
		}
		return NextResponse.json({ success: true, message: "Thank you. We'll get back to you shortly." });
	} catch (err) {
		console.error("[contact:api]", err);
		return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
	}
}


