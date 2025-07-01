import passport from "../passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "../../storage";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName + " " + profile.name?.familyName || "Google User";

          if (!email) {
            return done(new Error("No email found in Google profile"));
          }

          // Check if user already exists
          let user = await storage.getPublicUserByEmail(email);

          if (user) {
            // Update social accounts if not already connected
            const socialAccounts = Array.isArray(user.socialAccounts) ? user.socialAccounts : [];
            const hasGoogle = socialAccounts.some((account: any) => account.provider === "google");
            
            if (!hasGoogle) {
              socialAccounts.push({
                provider: "google",
                providerId: profile.id,
                connectedAt: new Date().toISOString(),
              });
              
              // Update user with new social account
              await storage.updatePublicUserSocialAccounts(user.id, socialAccounts);
            }
          } else {
            // Create new user
            user = await storage.createPublicUser({
              name,
              email,
              provider: "google",
              providerId: profile.id,
              socialAccounts: [
                {
                  provider: "google",
                  providerId: profile.id,
                  connectedAt: new Date().toISOString(),
                },
              ],
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error);
        }
      }
    )
  );
}

export default passport;