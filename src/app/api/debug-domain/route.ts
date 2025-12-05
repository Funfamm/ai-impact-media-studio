import { NextResponse } from "next/server";
import { Resend } from 'resend';

export async function GET() {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log("Debug Domain: Listing domains...");
        const listResult = await resend.domains.list();

        if (listResult.error) {
            throw new Error(`Failed to list domains: ${listResult.error.message}`);
        }

        const domains = listResult.data?.data || [];
        const targetDomain = domains.find(d => d.name === 'impactaistudio.com');

        let verifyResult = null;
        let message = "Domain not found in Resend account.";

        if (targetDomain) {
            console.log(`Debug Domain: Found domain ${targetDomain.name} (ID: ${targetDomain.id})`);
            console.log(`Debug Domain: Status is ${targetDomain.status}`);

            if (targetDomain.status === 'verified') {
                message = "Domain is already verified!";
            } else {
                console.log("Debug Domain: Triggering verification...");
                verifyResult = await resend.domains.verify(targetDomain.id);
                message = "Verification check triggered. Check DNS records.";
            }
        }

        return NextResponse.json({
            success: true,
            domains: domains.map(d => ({ name: d.name, id: d.id, status: d.status })),
            targetDomain,
            verifyResult,
            message
        });
    } catch (error) {
        console.error("Debug Domain: Failed", error);
        return NextResponse.json(
            { error: "Debug domain failed", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
