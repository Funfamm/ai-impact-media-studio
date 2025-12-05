// Shared email helper module for Resend email sending
// Provides functions to send admin notification and user confirmation emails.

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/EmailTemplate';
import React from 'react';

/**
 * Sends an email using Resend. If RESEND_API_KEY is not set, logs a simulated email.
 */
async function sendEmail(params: {
    to: string;
    subject: string;
    firstName: string;
    type: 'notification' | 'confirmation';
    message: React.ReactNode;
    details: { label: string; value: string }[];
}) {
    const { to, subject, firstName, type, message, details } = params;
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const data = await resend.emails.send({
                from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
                to,
                subject,
                react: (
                    <EmailTemplate
                        firstName={firstName}
                        type={type}
                        message={message}
                        details={details}
                    />
                ),
                text: `Hello ${firstName},\n\n${typeof message === 'string' ? message : 'Please view this email in a modern email client to see the full content.'}\n\n${details.map(d => `${d.label}: ${d.value}`).join('\n')}`,
            });
            console.log(`Email sent to ${to}. ID: ${data.data?.id}, Error: ${data.error}`);
            return data;
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            return { error: error instanceof Error ? error.message : String(error), data: null };
        }
    } else {
        console.warn('RESEND_API_KEY not found. Email sending skipped (simulated).');
        console.log('--- SIMULATED EMAIL ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('Content: (rendered by EmailTemplate)');
        console.log('-----------------------');
        return { data: { id: 'simulated' }, error: null };
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
