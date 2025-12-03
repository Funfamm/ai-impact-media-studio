import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { companyName, contactName, email, partnershipType, message } = data;

        // Basic validation
        if (!companyName || !contactName || !email || !partnershipType || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save to Firestore
        try {
            await addDoc(collection(db, "sponsors"), {
                companyName,
                contactName,
                email,
                partnershipType,
                message,
                status: "pending", // Default status
                createdAt: serverTimestamp(),
            });
            console.log("Sponsor inquiry saved to Firestore");
        } catch (dbError: unknown) {
            console.error("Error saving to Firestore:", dbError);
            const errorMessage = dbError instanceof Error ? dbError.message : "Unknown Firestore error";
            return NextResponse.json(
                { error: `Firestore Error: ${errorMessage}` },
                { status: 500 }
            );
        }

        // Send email using Resend
        if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com',
                subject: `New Sponsorship Inquiry from ${companyName}`,
                html: `
                    <h1>New Sponsorship Inquiry</h1>
                    <p><strong>Company:</strong> ${companyName}</p>
                    <p><strong>Contact Name:</strong> ${contactName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Partnership Interest:</strong> ${partnershipType}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });
            console.log("Admin notification sent successfully via Resend");

            // Send confirmation email to the user
            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: `Thank you for your interest in AI Impact Media Studio`,
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Thank You for Reaching Out!</h1>
                        <p>Dear ${contactName},</p>
                        <p>We have received your sponsorship inquiry regarding <strong>${companyName}</strong>.</p>
                        <p>Our team is reviewing your proposal for a <strong>${partnershipType}</strong> partnership and will get back to you shortly.</p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>The AI Impact Media Studio Team</strong></p>
                    </div>
                `
            });
            console.log("User confirmation email sent successfully via Resend");
        } else {
            console.warn("RESEND_API_KEY not found. Email sending skipped (simulated).");
            console.log("--- SIMULATED EMAIL ---");
            console.log(`To: ${process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com'}`);
            console.log(`Subject: New Sponsorship Inquiry from ${companyName}`);
            console.log(`Content: ${message}`);
            console.log("-----------------------");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting form:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
