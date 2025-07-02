import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adamkamelmahgoub@gmail.com",
    pass: "gbuz guvt wvfd djno"
  }
});

interface EmailOptions {
  subject: string;
  text: string;
}

export const sendEmail = async ({ subject, text }: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: "adamkamelmahgoub@gmail.com",
      to: "adamkamelmahgoub@gmail.com",
      subject,
      text
    });
    console.log(`✅ Email sent successfully: ${subject}`);
  } catch (error) {
    console.error(`❌ Failed to send email: ${subject}`, error);
    // Don't throw error to avoid breaking user flow
  }
};