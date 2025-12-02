import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
        if (!firstName || !lastName || !email || !gender || !signature) {
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

        // Upload files to Firebase Storage
        const uploadFile = async (file: File, path: string) => {
            const storageRef = ref(storage, path);
            const arrayBuffer = await file.arrayBuffer();
            await uploadBytes(storageRef, arrayBuffer);
            return await getDownloadURL(storageRef);
        };

        const headshotUrls = await Promise.all(
            headshots.map((file, index) =>
                uploadFile(file as File, `casting/${Date.now()}_headshot_${index}_${(file as File).name}`)
            )
        );

        const voiceSampleUrls = await Promise.all(
            voiceSamples.map((file, index) =>
                uploadFile(file as File, `casting/${Date.now()}_voice_${index}_${(file as File).name}`)
            )
        );

        // Save to Firestore
        await addDoc(collection(db, "casting_applications"), {
            firstName,
            lastName,
            email,
            phone,
            gender,
            socialHandle,
            socialType,
            signature,
            headshotUrls,
            voiceSampleUrls,
            status: "pending",
            aiEvaluation: null, // Placeholder for future AI evaluation
            createdAt: serverTimestamp(),
        });
        console.log("Casting application saved to Firestore");

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
            console.log("Admin notification sent successfully via Resend");

            // Send confirmation email to the applicant
            await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: email as string,
                subject: `Application Received - AI Impact Media Studio`,
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Application Received</h1>
                        <p>Dear ${firstName},</p>
                        <p>Thank you for submitting your casting application to AI Impact Media Studio.</p>
                        <p>We have successfully received your details and media assets. Our casting directors will review your submission.</p>
                        <p>If your profile matches our upcoming production needs, we will contact you directly.</p>
                        <br>
                        <p style="font-size: 0.9em; color: #666; font-style: italic;">
                            Please note: As outlined in the application, the contribution of your likeness and voice for our projects is a voluntary collaboration focused on professional exposure and portfolio development, and does not include financial compensation. We truly appreciate your willingness to be part of our creative vision.
                        </p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>The AI Impact Media Studio Team</strong></p>
                    </div>
                `
            });
            console.log("Applicant confirmation email sent successfully via Resend");
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
