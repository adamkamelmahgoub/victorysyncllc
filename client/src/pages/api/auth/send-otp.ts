// pages/api/auth/send-otp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { Pool } from 'pg';

// Create a connection pool to the Replit database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Replit provides this automatically
  ssl: {
    rejectUnauthorized: false
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiration

  try {
    // Prepare the SQL query to update the user
    const updateUserQuery = `
      UPDATE "users"
      SET "otp" = $1, "otpExpiresAt" = $2
      WHERE "email" = $3
    `;

    // Execute the query with the values
    await pool.query(updateUserQuery, [otp, otpExpiresAt, email]);

    // Send the email using Resend
    await resend.emails.send({
      from: 'info@victorysync.com',
      to: email,
      subject: 'Your VictorySync Verification Code',
      html: `<p>Your 6-digit verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
}