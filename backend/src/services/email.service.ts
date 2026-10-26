import { transporter } from '../config/email';

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

  if (!adminEmail) {
    console.warn('[WARN] ADMIN_EMAIL not set — skipping email notification');
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
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
        .body { padding: 32px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6366f1; margin-bottom: 6px; }
        .value { font-size: 15px; color: #1a1a2e; line-height: 1.6; }
        .cover { background: #f8f9ff; border-left: 3px solid #6366f1; padding: 16px; border-radius: 0 8px 8px 0; }
        .footer { border-top: 1px solid #e8e8f0; padding: 24px 32px; font-size: 13px; color: #888; }
        a.btn { display: inline-block; margin-top: 12px; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; margin-top: -4px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 1.94 0 0 1-2.06 0L2 7"/></svg>New Job Application</h1>
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
              ${data.currentCtc ? `<strong>Current CTC:</strong> ${data.currentCtc}<br>` : ''}
              ${data.expectedCtc ? `<strong>Expected CTC:</strong> ${data.expectedCtc}<br>` : ''}
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
        <div class="footer">This email was sent by the Job Portal application. Log in to your admin panel to manage applications.</div>
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

// Confirmation email to the applicant
export async function sendConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
): Promise<void> {
  const fromAddress = process.env.SMTP_FROM;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f8f9ff; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(99,102,241,0.1); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center; color: white; }
        .emoji { font-size: 48px; }
        .header h1 { margin: 16px 0 0; font-size: 22px; }
        .body { padding: 32px; font-size: 15px; line-height: 1.7; color: #444; }
        .footer { border-top: 1px solid #e8e8f0; padding: 20px 32px; font-size: 13px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="margin-bottom: 16px;"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h1>Application Received!</h1>
        </div>
        <div class="body">
          <p>Hi <strong>${applicantName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position. We've received your application and our team will review it shortly.</p>
          <p>If your profile matches what we're looking for, we'll reach out to schedule the next steps. We appreciate your interest!</p>
          <p>Best of luck,<br><strong>The Hiring Team</strong></p>
        </div>
        <div class="footer">You're receiving this because you applied via our job portal.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: applicantEmail,
    subject: `We received your application for ${jobTitle}`,
    html,
  });
}

// Status update email to the applicant
export async function sendStatusUpdateEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  status: string
): Promise<void> {
  const fromAddress = process.env.SMTP_FROM;

  let iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  let title = 'Application Update';
  let message = '';

  if (status === 'ACCEPTED') {
    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    title = 'Congratulations! You are accepted!';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>We are thrilled to inform you that your application for the <strong>${jobTitle}</strong> position has been accepted!</p>
               <p>Our team will be in touch with you shortly to discuss the next steps.</p>`;
  } else if (status === 'REJECTED') {
    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`;
    title = 'Update on your application';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>Thank you for your interest in the <strong>${jobTitle}</strong> position. After careful consideration, we have decided not to move forward with your application at this time.</p>
               <p>We appreciate the time you took to apply and wish you the best in your job search.</p>`;
  } else if (status === 'SWITCHED') {
    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;
    title = 'Role Switch';
    message = `<p>Hi <strong>${applicantName}</strong>,</p>
               <p>We are writing to let you know that our team has reviewed your profile and believes you are a great fit for a different role! We have moved your application to the <strong>${jobTitle}</strong> position.</p>
               <p>Our team will continue to process your application for this new role.</p>`;
  } else {
    // We only want to send emails for the terminal states as requested
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f8f9ff; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(99,102,241,0.1); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center; color: white; }
        .emoji { font-size: 48px; }
        .header h1 { margin: 16px 0 0; font-size: 22px; }
        .body { padding: 32px; font-size: 15px; line-height: 1.7; color: #444; }
        .footer { border-top: 1px solid #e8e8f0; padding: 20px 32px; font-size: 13px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="margin-bottom: 16px;">${iconHtml}</div>
          <h1>${title}</h1>
        </div>
        <div class="body">
          ${message}
          <p>Best regards,<br><strong>The Hiring Team</strong></p>
        </div>
        <div class="footer">You're receiving this because you applied via our job portal.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: applicantEmail,
    subject: `Application Update: ${jobTitle}`,
    html,
  });
}
