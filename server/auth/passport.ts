import passport from "passport";
import { generateJWT } from "../publicAuth";

// Helper function to create JWT for users
export const createJWT = (user: any) => {
  return generateJWT(user);
};

export default passport;