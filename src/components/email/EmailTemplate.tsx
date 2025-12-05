import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Link,
    Preview,
    Hr,
} from '@react-email/components';

interface EmailTemplateProps {
    firstName: string;
    message?: string | React.ReactNode;
    type: 'confirmation' | 'notification';
    details?: {
        label: string;
        value: string;
    }[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    message,
    type,
    details,
}) => {
    const isConfirmation = type === 'confirmation';
    const previewText = isConfirmation
        ? `Thank you for contacting AI Impact Media Studio`
        : `New submission from ${firstName}`;

    const mainColor = '#9333ea'; // Purple-600
    const backgroundColor = '#000000';
    const textColor = '#e5e7eb'; // Gray-200

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    {/* Header */}
                    <Section style={headerStyle}>
                        <Heading style={logoStyle}>
                            <span style={{ color: mainColor }}>AI</span> Impact Studio
                        </Heading>
                    </Section>

                    {/* Content */}
                    <Section style={contentStyle}>
                        <Heading style={headingStyle}>
                            {isConfirmation ? `Hello ${firstName},` : 'New Submission Received'}
                        </Heading>

                        <Text style={textStyle}>
                            {message || (isConfirmation
                                ? "Thank you for reaching out to AI Impact Media Studio. We have received your submission and our team will review it shortly."
                                : `A new submission has been received from ${firstName}.`
                            )}
                        </Text>

                        {details && details.length > 0 && (
                            <Section style={detailsContainerStyle}>
                                <Heading as="h3" style={subHeadingStyle}>
                                    Submission Details
                                </Heading>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {details.map((item, index) => (
                                            <tr key={index}>
                                                <td style={labelStyle}>
                                                    {item.label}:
                                                </td>
                                                <td style={valueStyle}>
                                                    {item.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Section>
                        )}

                        {isConfirmation && (
                            <Section style={footerNoteStyle}>
                                <Text style={footerNoteTextStyle}>
                                    Please note: This is an automated response. If your inquiry requires immediate attention, please contact us directly through our support channels.
                                </Text>
                            </Section>
                        )}
                    </Section>

                    {/* Footer */}
                    <Section style={footerStyle}>
                        <Text style={footerTextStyle}>
                            © {new Date().getFullYear()} AI Impact Media Studio. All rights reserved.
                        </Text>
                        <div style={{ marginTop: '10px' }}>
                            <Link href="https://ai-impact-media-studio.com" style={linkStyle}>Website</Link>
                            <Link href="https://ai-impact-media-studio.com/privacy" style={linkStyle}>Privacy Policy</Link>
                        </div>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const mainStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: '#f3f4f6',
    padding: '40px 20px',
};

const containerStyle = {
    margin: '0 auto',
    backgroundColor: '#000000',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
};

const headerStyle = {
    backgroundColor: '#111827',
    padding: '30px 40px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #374151',
};

const logoStyle = {
    color: '#ffffff',
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
};

const contentStyle = {
    padding: '40px',
    color: '#e5e7eb',
};

const headingStyle = {
    color: '#ffffff',
    fontSize: '20px',
    marginTop: 0,
    marginBottom: '20px',
};

const textStyle = {
    lineHeight: '1.6',
    marginBottom: '24px',
    color: '#d1d5db',
    fontSize: '16px',
};

const detailsContainerStyle = {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #374151',
};

const subHeadingStyle = {
    color: '#ffffff',
    fontSize: '16px',
    marginTop: 0,
    marginBottom: '16px',
    borderBottom: '1px solid #374151',
    paddingBottom: '8px',
};

const labelStyle = {
    padding: '8px 0',
    color: '#9ca3af',
    fontSize: '14px',
    width: '140px',
    verticalAlign: 'top' as const,
};

const valueStyle = {
    padding: '8px 0',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
};

const footerNoteStyle = {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #374151',
};

const footerNoteTextStyle = {
    fontSize: '14px',
    color: '#9ca3af',
    fontStyle: 'italic',
    margin: 0,
};

const footerStyle = {
    backgroundColor: '#111827',
    padding: '20px 40px',
    textAlign: 'center' as const,
    borderTop: '1px solid #374151',
};

const footerTextStyle = {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
};

const linkStyle = {
    color: '#9333ea',
    textDecoration: 'none',
    fontSize: '12px',
    margin: '0 10px',
};

