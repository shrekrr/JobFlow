const nodemailer = require("nodemailer");
require("dotenv").config();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendApplicationEmail({ to, candidateName, jobTitle, company, resumeBuffer, resumeFilename, coverLetterText }) {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"JobFlow Application" <${process.env.SMTP_USER}>`,
    to: to || process.env.HR_EMAIL || "hr@example.com",
    subject: `Job Application: ${jobTitle} at ${company} - ${candidateName}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">New Job Application</h2>
        <p><strong>Candidate:</strong> ${candidateName}</p>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${company}</p>
        <hr style="border: 1px solid #eee;" />
        <h3 style="color: #1a1a2e;">Cover Letter</h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">${coverLetterText || "No cover letter provided."}</div>
        <hr style="border: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px;">Sent via JobFlow - AI Job Application Platform</p>
      </div>
    `,
    attachments: [
      {
        filename: resumeFilename || "resume.txt",
        content: resumeBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendApplicationEmail };