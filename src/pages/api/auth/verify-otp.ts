// pages/api/auth/verify-otp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Create a connection pool to the Replit database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Replit provides this automatically
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    // First, find the user and their stored OTP data
    const userQuery = 'SELECT "otp", "otpExpiresAt" FROM "users" WHERE "email" = $1';
    const { rows } = await pool.query(userQuery, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // Check if the OTP is correct and if it has expired
    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // If the OTP is correct, update the user to mark them as verified
    // and clear out the OTP fields for security.
    const updateUserQuery = `
      UPDATE "users"
      SET "isVerified" = true, "otp" = NULL, "otpExpiresAt" = NULL
      WHERE "email" = $1
    `;
    await pool.query(updateUserQuery, [email]);

    // Here you would normally generate a session token (JWT) to log the user in
    return res.status(200).json({ message: 'Account verified successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}