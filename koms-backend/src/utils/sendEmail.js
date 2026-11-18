import nodemailer from "nodemailer";

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();

  // No SMTP configured: print the email in the terminal for development.
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured");
    }

    console.log("\n=== EMAIL (SMTP not configured, printing instead) ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("=====================================================\n");
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Ims Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}