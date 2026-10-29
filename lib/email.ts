import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyEmailConfig(): Promise<void> {
  try {
    await transporter.verify();
    console.log('[OK] Email transporter ready');
  } catch (err) {
    console.warn('[WARN] Email transporter not ready — check SMTP credentials:', err);
  }
}

interface ApplicationEmailData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  jobTitle: string;
  company: string;
  coverLetter: string;
  resumeUrl?: string;
  appliedAt: string;
}

export async function sendApplicationEmail(data: ApplicationEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromAddress = process.env.SMTP_FROM;

  if (!adminEmail || !fromAddress || !process.env.SMTP_HOST) {
    console.warn('[WARN] SMTP not configured — skipping admin notification email');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; background: #f8f9ff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(99,102,241,0.1); }
        .header { background: linear-gradient(135deg, #1e496a 0%, #11314a 100%); padding: 32px; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
        .body { padding: 32px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #1e496a; margin-bottom: 6px; }
        .value { font-size: 15px; color: #1a1a2e; line-height: 1.6; }
        .cover { background: #f8f9ff; border-left: 3px solid #1e496a; padding: 16px; border-radius: 0 8px 8px 0; }
        .footer { border-top: 1px solid #e8e8f0; padding: 24px 32px; font-size: 13px; color: #888; }
        a.btn { display: inline-block; margin-top: 12px; background: #1e496a; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Job Application</h1>
          <p>Someone applied for <strong>${data.jobTitle}</strong> at ${data.company}</p>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">Applicant</div>
            <div class="value">${data.applicantName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.applicantEmail}">${data.applicantEmail}</a></div>
          </div>
          ${data.applicantPhone ? `
          <div class="field">
            <div class="label">Phone</div>
            <div class="value">${data.applicantPhone}</div>
          </div>` : ''}
          ${(data.currentCtc || data.expectedCtc || data.noticePeriod) ? `
          <div class="field">
            <div class="label">Compensation & Availability</div>
            <div class="value">
              ${data.currentCtc ? `<strong>Current Salary:</strong> ${data.currentCtc}<br>` : ''}
              ${data.expectedCtc ? `<strong>Expected Salary:</strong> ${data.expectedCtc}<br>` : ''}
              ${data.noticePeriod ? `<strong>Notice Period:</strong> ${data.noticePeriod}` : ''}
            </div>
          </div>` : ''}
          <div class="field">
            <div class="label">Position</div>
            <div class="value">${data.jobTitle} — ${data.company}</div>
          </div>
          <div class="field">
            <div class="label">Applied at</div>
            <div class="value">${data.appliedAt}</div>
          </div>
          <div class="field">
            <div class="label">Cover Letter</div>
            <div class="value cover">${data.coverLetter.replace(/\n/g, '<br>')}</div>
          </div>
          ${data.resumeUrl ? `
          <div class="field">
            <div class="label">Resume</div>
            <div class="value"><a class="btn" href="${data.resumeUrl}" target="_blank">View Resume →</a></div>
          </div>` : ''}
        </div>
        <div class="footer">This email was sent by the Solitaire Portal application.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: adminEmail,
    subject: `[New Application] ${data.applicantName} applied for ${data.jobTitle}`,
    html,
  });
}

export async function sendConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
): Promise<void> {
  const fromAddress = process.env.SMTP_FROM;
  if (!fromAddress || !process.env.SMTP_HOST) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f8f9ff; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(30,73,106,0.1); }
        .header { background: linear-gradient(135deg, #1e496a 0%, #11314a 100%); padding: 40px 32px; text-align: center; color: white; }
        .header h1 { margin: 16px 0 0; font-size: 22px; }
        .body { padding: 32px; font-size: 15px; line-height: 1.7; color: #444; }
        .footer { border-top: 1px solid #e8e8f0; padding: 20px 32px; font-size: 13px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Received!</h1>
        </div>
        <div class="body">
          <p>Hi <strong>${applicantName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position with Solitaire Consultancy. We've received your application and our recruitment team will review it shortly.</p>
          <p>If your profile aligns with the role, we will reach out to discuss the next steps.</p>
          <p>Best regards,<br><strong>The Solitaire Team</strong></p>
        </div>
        <div class="footer">You're receiving this because you applied via the Solitaire job portal.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: applicantEmail,
    subject: `We received your application for ${jobTitle} — Solitaire Consultancy`,
    html,
  });
}

export async function sendStatusUpdateEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  status: string
): Promise<void> {
  const fromAddress = process.env.SMTP_FROM;
  if (!fromAddress || !process.env.SMTP_HOST) return;

  let title = 'Application Update';
  let message = '';

  if (status === 'ACCEPTED') {
    title = 'Congratulations! You are accepted!';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>We are thrilled to inform you that your application for the <strong>${jobTitle}</strong> position has been accepted!</p>
               <p>Our team will be in touch with you shortly to discuss the next steps.</p>`;
  } else if (status === 'REJECTED') {
    title = 'Update on your application';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>Thank you for your interest in the <strong>${jobTitle}</strong> position. After careful review, we have decided not to proceed further at this time.</p>
               <p>We appreciate the time you took to apply and wish you the best in your career endeavors.</p>`;
  } else if (status === 'SWITCHED') {
    title = 'Role Switch Recommendation';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>Our team has reviewed your profile and identified that you are a strong match for another position! We have updated your application to the <strong>${jobTitle}</strong> position.</p>`;
  } else {
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f8f9ff; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(30,73,106,0.1); }
        .header { background: linear-gradient(135deg, #1e496a 0%, #11314a 100%); padding: 40px 32px; text-align: center; color: white; }
        .header h1 { margin: 16px 0 0; font-size: 22px; }
        .body { padding: 32px; font-size: 15px; line-height: 1.7; color: #444; }
        .footer { border-top: 1px solid #e8e8f0; padding: 20px 32px; font-size: 13px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="body">
          ${message}
          <p>Best regards,<br><strong>The Solitaire Hiring Team</strong></p>
        </div>
        <div class="footer">You're receiving this update from Solitaire Human Resources Consultancy.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: applicantEmail,
    subject: `Application Update: ${jobTitle} — Solitaire Consultancy`,
    html,
  });
}
