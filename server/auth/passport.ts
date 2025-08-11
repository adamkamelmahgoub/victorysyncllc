import passport from "passport";
// JWT generation is handled in publicAuth.ts routes

// Helper function to create JWT for users
export const createJWT = (user: any) => {
  return generateTokenPair(user);
};

export default passport;