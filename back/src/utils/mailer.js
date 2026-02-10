import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || `NoReply <no-reply@example.com>`;

if (!host || !user || !pass) {
  console.warn("Mailer not fully configured. Check SMTP_HOST/SMTP_USER/SMTP_PASS in .env");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass
  }
});

transporter.verify().then(() => {
  console.log("Mailer: SMTP connection successful");
}).catch(err => {
  console.warn("Mailer verify failed (safe to ignore in dev):", err.message || err);
});

export async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error("sendEmail: 'to' is required");
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html
  };
  return transporter.sendMail(mailOptions);
}
