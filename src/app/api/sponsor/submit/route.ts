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

        // Mock processing - In a real app, we would save to database
        console.log("--- New Sponsor Inquiry Received ---");
        console.log(`Company: ${companyName}`);
        console.log(`Contact: ${contactName}`);
        console.log(`Email: ${email}`);
        console.log(`Type: ${partnershipType}`);
        console.log(`Message: ${message}`);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

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
            console.log("Email sent successfully via Resend");
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
