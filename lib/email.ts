// Basic email service — logs operational info only (no PII).
// Replace with nodemailer/SendGrid when SMTP credentials are available.

export async function sendApprovalEmail(email: string, name: string) {
    console.log(`[EMAIL SERVICE] Approval email dispatched`);
    // TODO: implement real email sending via SMTP/SendGrid
    return true;
}

export async function sendRejectionEmail(email: string, name: string) {
    console.log(`[EMAIL SERVICE] Rejection email dispatched`);
    // TODO: implement real email sending via SMTP/SendGrid
    return true;
}
