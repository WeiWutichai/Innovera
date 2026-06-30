// Basic email service — logs operational info only (no PII).
// Replace with nodemailer/SendGrid when SMTP credentials are available.

export async function sendApprovalEmail(email: string, name: string) {
    console.warn('[EMAIL SERVICE] STUB — no email actually sent (type: approval). Configure SMTP/SendGrid.');
    // TODO: implement real email sending via SMTP/SendGrid
    return true;
}

export async function sendRejectionEmail(email: string, name: string) {
    console.warn('[EMAIL SERVICE] STUB — no email actually sent (type: rejection). Configure SMTP/SendGrid.');
    // TODO: implement real email sending via SMTP/SendGrid
    return true;
}
