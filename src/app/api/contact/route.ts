/* Short title: Contact API route with validation and errors */
import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/features/contact/contract";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = contactRequestSchema.safeParse(body);
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


