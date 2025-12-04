import * as React from 'react';

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

    const mainColor = '#9333ea'; // Purple-600
    const backgroundColor = '#000000';
    const textColor = '#e5e7eb'; // Gray-200

    return (
        <div style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            backgroundColor: '#f3f4f6',
            padding: '40px 20px',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: backgroundColor,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#111827', // Gray-900
                    padding: '30px 40px',
                    textAlign: 'center',
                    borderBottom: `1px solid #374151`,
                }}>
                    <h1 style={{
                        color: '#ffffff',
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        letterSpacing: '-0.025em',
                    }}>
                        <span style={{ color: mainColor }}>AI</span> Impact Studio
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    padding: '40px',
                    color: textColor,
                }}>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: '20px',
                        marginTop: 0,
                        marginBottom: '20px',
                    }}>
                        {isConfirmation ? `Hello ${firstName},` : 'New Submission Received'}
                    </h2>

                    <div style={{
                        lineHeight: '1.6',
                        marginBottom: '24px',
                        color: '#d1d5db', // Gray-300
                    }}>
                        {message || (isConfirmation
                            ? "Thank you for reaching out to AI Impact Media Studio. We have received your submission and our team will review it shortly."
                            : `A new submission has been received from ${firstName}.`
                        )}
                    </div>

                    {details && details.length > 0 && (
                        <div style={{
                            backgroundColor: '#1f2937', // Gray-800
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '24px',
                            border: '1px solid #374151',
                        }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '16px',
                                marginTop: 0,
                                marginBottom: '16px',
                                borderBottom: '1px solid #374151',
                                paddingBottom: '8px',
                            }}>
                                Submission Details
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {details.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{
                                                padding: '8px 0',
                                                color: '#9ca3af', // Gray-400
                                                fontSize: '14px',
                                                width: '140px',
                                                verticalAlign: 'top',
                                            }}>
                                                {item.label}:
                                            </td>
                                            <td style={{
                                                padding: '8px 0',
                                                color: '#ffffff',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}>
                                                {item.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {isConfirmation && (
                        <div style={{
                            marginTop: '30px',
                            paddingTop: '20px',
                            borderTop: '1px solid #374151',
                            fontSize: '14px',
                            color: '#9ca3af',
                            fontStyle: 'italic',
                        }}>
                            <p style={{ margin: 0 }}>
                                Please note: This is an automated response. If your inquiry requires immediate attention, please contact us directly through our support channels.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#111827',
                    padding: '20px 40px',
                    textAlign: 'center',
                    borderTop: '1px solid #374151',
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#6b7280', // Gray-500
                    }}>
                        © {new Date().getFullYear()} AI Impact Media Studio. All rights reserved.
                    </p>
                    <div style={{
                        marginTop: '10px',
                    }}>
                        <a href="https://ai-impact-media-studio.com" style={{ color: mainColor, textDecoration: 'none', fontSize: '12px', margin: '0 10px' }}>Website</a>
                        <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '12px', margin: '0 10px' }}>Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
