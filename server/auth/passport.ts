import passport from "passport";
import { storage } from "../storage";
import { generateJWT } from "../publicAuth";

// Import OAuth strategies
import "./strategies/google";
import "./strategies/facebook";
import "./strategies/apple";

// Passport serialization for session-based auth (optional, mainly for OAuth flows)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getPublicUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Helper function to create JWT for OAuth users
export const createJWT = (user: any) => {
  return generateJWT(user);
};

export default passport;