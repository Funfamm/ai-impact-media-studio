// Shared email helper module for Resend email sending
// Provides functions to send admin notification and user confirmation emails.

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/EmailTemplate';
import React from 'react';

/**
 * Sends an email using Resend. Returns a structured result.
 * If RESEND_API_KEY is not set, logs a simulated email and returns a success result.
 */
async function sendEmail(params: {
    to: string;
    subject: string;
    firstName: string;
    type: 'notification' | 'confirmation';
    message: React.ReactNode;
    details: { label: string; value: string }[];
}): Promise<{ success: boolean; data?: any; error?: string | null }> {
    const { to, subject, firstName, type, message, details } = params;
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set. Email sending simulated.');
        console.log('--- SIMULATED EMAIL ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('Content: (rendered by EmailTemplate)');
        console.log('-----------------------');
        return { success: true, data: { id: 'simulated' }, error: null };
    }
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log("Sending to:", to);
        const data = await resend.emails.send({
            from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
            to,
            subject,
            react: (
                <EmailTemplate firstName={firstName} type={type} message={message} details={details} />
            ),
            text: `Hello ${firstName},\n\n${typeof message === 'string' ? message : 'Please view this email in a modern email client to see the full content.'}\n\n${details.map(d => `${d.label}: ${d.value}`).join('\n')}`,
        });
        console.log("Resend response:", data);
        console.log(`Email sent to ${to}. ID: ${data.data?.id}, Error: ${data.error}`);
        return { success: !data.error, data: data.data, error: data.error ? data.error.message : null };
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        return { success: false, error: error instanceof Error ? error.message : String(error), data: null };
    }
}

/**
 * Send admin notification email for casting or sponsor submissions.
 */
export async function sendAdminNotification(params: {
    to: string; // admin email address
    subject: string;
    firstName: string;
    message: string;
    details: { label: string; value: string }[];
}) {
    return await sendEmail({
        to: params.to,
        subject: params.subject,
        firstName: params.firstName,
        type: 'notification',
        message: params.message,
        details: params.details,
    });
}

/**
 * Send user confirmation email.
 */
export async function sendUserConfirmation(params: {
    to: string;
    subject: string;
    firstName: string;
    message: React.ReactNode;
    details: { label: string; value: string }[];
}) {
    return await sendEmail({
        to: params.to,
        subject: params.subject,
        firstName: params.firstName,
        type: 'confirmation',
        message: params.message,
        details: params.details,
    });
}

export default { sendAdminNotification, sendUserConfirmation };
