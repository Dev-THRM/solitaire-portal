import nodemailer from 'nodemailer';

// Create a reusable transporter using SMTP settings from env
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter on startup (non-blocking — only logs)
export async function verifyEmailConfig(): Promise<void> {
  try {
    await transporter.verify();
    console.log('[OK] Email transporter ready');
  } catch (err) {
    console.warn('[WARN] Email transporter not ready — check SMTP credentials:', err);
  }
}
