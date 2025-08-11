import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { generateTokenPair } from '../lib/jwt';

// JWT generation is handled in publicAuth.ts routes

// Helper function to create JWT for users
export const createJWT = (user: any) => {
  return generateTokenPair(user);
};

export default passport;