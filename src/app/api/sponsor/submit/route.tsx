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
            const { EmailTemplate } = await import('@/components/email/EmailTemplate');
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Admin Notification
            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com',
                subject: `New Sponsorship Inquiry from ${companyName}`,
                react: (
                    <EmailTemplate
                        firstName={contactName}
                        type="notification"
                        message={`A new sponsorship inquiry has been received from ${companyName}.`}
                        details={[
                            { label: 'Company', value: companyName },
                            { label: 'Contact Name', value: contactName },
                            { label: 'Email', value: email },
                            { label: 'Partnership', value: partnershipType },
                            { label: 'Message', value: message },
                        ]}
                    />
                )
            });
            console.log("Admin notification sent successfully via Resend");

            // User Confirmation
            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: `Partnership Inquiry Received - AI Impact Media Studio`,
                react: (
                    <EmailTemplate
                        firstName={contactName}
                        type="confirmation"
                        message={
                            <>
                                Thank you for your interest in partnering with AI Impact Media Studio. We have received your inquiry regarding <strong>{companyName}</strong>.
                                <br /><br />
                                We appreciate you reaching out to explore a <strong>{partnershipType}</strong> collaboration. Our team is currently reviewing your proposal to determine how we can best align our innovative media solutions with your strategic goals. We aim to respond to all partnership inquiries within 3-5 business days.
                                <br /><br />
                                In the meantime, feel free to explore our latest projects on our website to see how we are redefining the future of media.
                            </>
                        }
                        details={[
                            { label: 'Inquiry ID', value: Date.now().toString() },
                            { label: 'Partnership Type', value: partnershipType },
                            { label: 'Status', value: 'Under Review' }
                        ]}
                    />
                )
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
