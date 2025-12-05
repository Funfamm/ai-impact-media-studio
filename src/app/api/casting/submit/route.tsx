import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { sendAdminNotification, sendUserConfirmation } from '@/lib/email';


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

        // Prepare file names for email
        const headshotFileNames = headshots.map(file => (file as File).name).join(', ');
        const voiceSampleFileNames = voiceSamples.map(file => (file as File).name).join(', ');

        // Send email using shared helper
        if (process.env.RESEND_API_KEY) {
            // Admin Notification
            await sendAdminNotification({
                to: process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com',
                subject: `New Casting Submission: ${firstName} ${lastName}`,
                firstName: `${firstName} ${lastName}`,
                message: `A new casting application has been received from ${firstName} ${lastName}.`,
                details: [
                    { label: 'Name', value: `${firstName} ${lastName}` },
                    { label: 'Email', value: email as string },
                    { label: 'Phone', value: phone as string },
                    { label: 'Gender', value: gender as string },
                    { label: 'Social', value: `${socialType} - ${socialHandle}` },
                    { label: 'Headshots', value: headshotFileNames },
                    { label: 'Voice Samples', value: voiceSampleFileNames },
                ],
            });

            // User Confirmation
            await sendUserConfirmation({
                to: email as string,
                subject: `Application Received - AI Impact Media Studio`,
                firstName: firstName as string,
                message: (
                    <>
                        Thank you for submitting your casting application to AI Impact Media Studio. We have successfully received your details and media assets.
                        <br /><br />
                        Our casting directors are currently reviewing your submission. If your profile aligns with the creative vision of our upcoming productions, we will reach out to you directly to discuss next steps.
                        <br /><br />
                        <strong>Important Note regarding your application:</strong>
                        <br />
                        Please be reminded that participation in our projects is a voluntary collaboration. As outlined in our casting terms, there is no financial compensation provided for this role. This opportunity is designed for professional exposure, portfolio development, and the unique experience of collaborating on cutting‑edge AI‑driven media productions. We truly appreciate your passion and willingness to contribute your talent to our vision.
                    </>
                ),
                details: [
                    { label: 'Application ID', value: Date.now().toString() },
                    { label: 'Role Interest', value: 'Casting / Voice Acting' },
                    { label: 'Status', value: 'Under Review' },
                ],
            });
        } else {
            console.warn('RESEND_API_KEY not found. Email sending skipped (simulated).');
            console.log('--- SIMULATED EMAIL ---');
            console.log(`To: ${process.env.CONTACT_EMAIL || 'impact-media@impactaistudio.com'}`);
            console.log(`Subject: New Casting Submission: ${firstName} ${lastName}`);
            console.log('-----------------------');
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
