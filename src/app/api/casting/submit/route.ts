import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract fields
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const gender = formData.get("gender");
        const socialHandle = formData.get("socialHandle");
        const socialType = formData.get("socialType");
        const signature = formData.get("signature");

        // Extract files
        const headshots = formData.getAll("headshots");
        const voiceSamples = formData.getAll("voiceSamples");

        // Basic validation
        if (!firstName || !lastName || !email || !phone || !gender || !signature) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (headshots.length === 0) {
            return NextResponse.json(
                { error: "At least one headshot is required" },
                { status: 400 }
            );
        }

        if (voiceSamples.length === 0) {
            return NextResponse.json(
                { error: "Voice sample is required" },
                { status: 400 }
            );
        }

        // Mock processing - In a real app, we would upload files to S3/Blob storage
        // and save the application to a database.
        console.log("--- New Casting Application Received ---");
        console.log(`Name: ${firstName} ${lastName}`);
        console.log(`Email: ${email}`);
        console.log(`Phone: ${phone}`);
        console.log(`Gender: ${gender}`);
        console.log(`Social: ${socialType} - ${socialHandle}`);
        console.log(`Signature: ${signature}`);
        console.log(`Headshots: ${headshots.length} files`);
        console.log(`Voice Samples: ${voiceSamples.length} files`);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Send email using Resend
        if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Assuming headshots and voiceSamples are File objects or similar
            const headshotFileNames = headshots.map(file => (file as File).name).join(', ');
            const voiceSampleFileNames = voiceSamples.map(file => (file as File).name).join(', ');

            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com',
                subject: `New Casting Submission: ${firstName} ${lastName}`,
                html: `
                    <h1>New Casting Submission</h1>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Gender:</strong> ${gender}</p>
                    <p><strong>Social:</strong> ${socialType} - ${socialHandle}</p>
                    <p><strong>Files:</strong></p>
                    <ul>
                        <li>Headshots: ${headshotFileNames}</li>
                        <li>Voice Samples: ${voiceSampleFileNames}</li>
                    </ul>
                `
            });
            console.log("Email sent successfully via Resend");
        } else {
            console.warn("RESEND_API_KEY not found. Email sending skipped (simulated).");
            console.log("--- SIMULATED EMAIL ---");
            console.log(`To: ${process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com'}`);
            console.log(`Subject: New Casting Submission: ${firstName} ${lastName}`);
            console.log("-----------------------");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing casting application:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
