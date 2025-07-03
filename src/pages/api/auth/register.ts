// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Create a connection pool to the Replit database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Basic validation
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid input. Password must be at least 6 characters long.' });
  }

  try {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Prepare the SQL query to insert the new user
    const insertUserQuery = `
      INSERT INTO "users" (email, password, "isVerified")
      VALUES ($1, $2, false)
      RETURNING id, email;
    `;

    // Execute the query
    const newUser = await pool.query(insertUserQuery, [email, hashedPassword]);

    res.status(201).json({ user: newUser.rows[0] });

  } catch (error) {
    console.error(error);

    // Check if the error is due to a duplicate email (unique constraint violation)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}