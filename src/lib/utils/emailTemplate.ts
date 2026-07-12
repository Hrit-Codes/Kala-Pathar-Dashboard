export const buildInquiryReplyPreview = (
  fullname: string,
  originalSubject: string,
  replyMessage: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
            .header { background: #1a6b3c; padding: 24px 32px; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
            .body { padding: 32px; color: #333333; }
            .body p { line-height: 1.7; margin: 0 0 16px; }
            .original { background: #f9f9f9; border-left: 4px solid #1a6b3c; padding: 16px; margin: 24px 0; border-radius: 4px; }
            .original p { margin: 0; color: #555; font-size: 14px; }
            .footer { padding: 24px 32px; background: #f4f4f4; text-align: center; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Kala Patthar Treks Expeditions</h1>
            </div>
            <div class="body">
                <p>Dear ${fullname || "Guest"},</p>
                <p>Thank you for reaching out to us. Here is our response to your inquiry:</p>
                <div class="original">
                    <p><strong>Your inquiry:</strong> ${originalSubject || ""}</p>
                </div>
                ${replyMessage || "<p style='color:#aaa'>(Your reply will appear here)</p>"}
                <p>If you have any further questions, feel free to reply to this email.</p>
                <p>Warm regards,<br/><strong>Kala Patthar Expeditions Team</strong></p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Kala Patthar Expeditions & PVT.LTD. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

interface Attachment {
    fileName: string;
    localPath: string;
    mimeType: string;
}

interface CampaignEmailOptions {
    email: string;
    subject: string;
    body: string;
    unsubscribeUrl: string;
    attachments?: Attachment[];
    companyName?: string;
}

// Get file icon based on mime type
const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎬";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("msword") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("spreadsheet") || mimeType.includes("sheet")) return "📊";
    if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
    return "📎";
};

// Get file type label
const getFileTypeLabel = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.includes("pdf")) return "PDF Document";
    if (mimeType.includes("msword")) return "Word Document";
    if (mimeType.includes("document")) return "Document";
    return "File";
};

export const buildCampaignEmail = ({
    email,
    subject,
    body,
    unsubscribeUrl,
    attachments = [],
    companyName = "Kala Patthar Treks",
}: CampaignEmailOptions): string => {
    // Build attachments HTML
    const attachmentsHtml = attachments.length > 0 ? `
        <div style="margin: 24px 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: #f0f7f0; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; justify-content: space-between;">
                <strong style="color: #047857; font-size: 14px;">📎 Attachments (${attachments.length} file${attachments.length > 1 ? 's' : ''})</strong>
                <span style="background: #047857; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                    ${attachments.length}/3
                </span>
            </div>
            <div style="padding: 12px 16px; background: #ffffff;">
                ${attachments.map((file, index) => `
                    <div style="display: flex; align-items: center; padding: 10px 0; ${index < attachments.length - 1 ? 'border-bottom: 1px solid #f0f0f0;' : ''}">
                        <div style="width: 40px; height: 40px; background: #f0f7f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 20px; flex-shrink: 0;">
                            ${getFileIcon(file.mimeType)}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 600; color: #1a1a1a; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${file.fileName}
                            </div>
                            <div style="font-size: 12px; color: #888; margin-top: 2px;">
                                ${getFileTypeLabel(file.mimeType)} • ${file.mimeType}
                            </div>
                        </div>
                        <div style="background: #047857; color: white; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; flex-shrink: 0; margin-left: 8px;">
                            Attached
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${subject}</title>
            <style>
                /* Reset styles */
                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background: #f4f4f4;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }
                /* Header */
                .header {
                    background: linear-gradient(135deg, #047857 0%, #065f46 100%);
                    padding: 32px 32px 28px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                .header .subtitle {
                    color: rgba(255, 255, 255, 0.85);
                    margin: 6px 0 0;
                    font-size: 14px;
                    font-weight: 400;
                }
                .header .divider {
                    width: 60px;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.3);
                    margin: 12px auto 0;
                    border-radius: 2px;
                }
                /* Body */
                .body {
                    padding: 32px 32px 24px;
                    color: #1a1a1a;
                    line-height: 1.8;
                }
                .body .greeting {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 20px;
                }
                .body .message {
                    color: #333;
                    font-size: 15px;
                }
                .body .message p {
                    margin: 0 0 16px;
                }
                .body .message a {
                    color: #047857;
                    text-decoration: underline;
                }
                .body .message strong {
                    color: #047857;
                }
                /* Unsubscribe Section */
                .unsubscribe-section {
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 2px solid #f0f0f0;
                    text-align: center;
                }
                .unsubscribe-section .unsubscribe-link {
                    color: #047857;
                    text-decoration: underline;
                    font-size: 13px;
                    font-weight: 500;
                }
                .unsubscribe-section .unsubscribe-text {
                    color: #999;
                    font-size: 12px;
                    margin: 6px 0 0;
                }
                /* Footer */
                .footer {
                    padding: 20px 32px;
                    background: #f8faf8;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                    border-top: 1px solid #e8e8e8;
                }
                .footer .company-name {
                    font-weight: 600;
                    color: #047857;
                }
                .footer .footer-links {
                    margin-top: 8px;
                }
                .footer .footer-links a {
                    color: #888;
                    text-decoration: none;
                    margin: 0 8px;
                    font-size: 11px;
                }
                .footer .footer-links a:hover {
                    color: #047857;
                }
                .footer .copyright {
                    margin-top: 8px;
                    color: #aaa;
                    font-size: 11px;
                }
                /* Responsive */
                @media only screen and (max-width: 480px) {
                    .container { margin: 0; border-radius: 0; }
                    .body { padding: 20px; }
                    .header { padding: 24px 20px; }
                    .header h1 { font-size: 20px; }
                    .footer { padding: 16px 20px; }
                    .attachments-list { padding: 8px 12px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <h1>🏔️ ${companyName}</h1>
                    <p class="subtitle">Premium Himalayan Expeditions</p>
                    <div class="divider"></div>
                </div>

                <!-- Body -->
                <div class="body">
                    <div class="greeting">Hello ${email},</div>
                    <div class="message">
                        ${body}
                    </div>
                    
                    <!-- Attachments -->
                    ${attachmentsHtml}
                </div>

                <!-- Unsubscribe Section -->
                <div style="padding: 0 32px 32px;">
                    <div class="unsubscribe-section">
                        <a href="${unsubscribeUrl}" class="unsubscribe-link">Unsubscribe from these emails</a>
                        <p class="unsubscribe-text">You're receiving this because you subscribed to our newsletter.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p><span class="company-name">${companyName}</span> &amp; Expeditions PVT.LTD.</p>
                    <div class="footer-links">
                        <a href="${process.env.FRONTEND_URL || '#'}">Website</a>
                        <span style="color: #ddd;">·</span>
                        <a href="${process.env.FRONTEND_URL || '#'}/contact">Contact</a>
                        <span style="color: #ddd;">·</span>
                        <a href="${process.env.FRONTEND_URL || '#'}/privacy">Privacy Policy</a>
                    </div>
                    <p class="copyright">© ${new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};