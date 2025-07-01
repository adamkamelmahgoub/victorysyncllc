import passport from "../passport";
import { Strategy as AppleStrategy } from "passport-apple";
import { storage } from "../../storage";

const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const APPLE_KEY_ID = process.env.APPLE_KEY_ID;
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY;

if (APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY) {
  passport.use(
    "apple",
    new AppleStrategy(
      {
        clientID: APPLE_CLIENT_ID,
        teamID: APPLE_TEAM_ID,
        keyID: APPLE_KEY_ID,
        privateKey: APPLE_PRIVATE_KEY,
        callbackURL: "/api/auth/apple/callback",
        scope: ["name", "email"],
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Apple provides user info in the idToken
          const email = profile.email;
          const name = profile.name ? `${profile.name.firstName || ""} ${profile.name.lastName || ""}`.trim() : "Apple User";

          if (!email) {
            return done(new Error("No email found in Apple profile"));
          }

          // Check if user already exists
          let user = await storage.getPublicUserByEmail(email);

          if (user) {
            // Update social accounts if not already connected
            const socialAccounts = Array.isArray(user.socialAccounts) ? user.socialAccounts : [];
            const hasApple = socialAccounts.some((account: any) => account.provider === "apple");
            
            if (!hasApple) {
              socialAccounts.push({
                provider: "apple",
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
              provider: "apple",
              providerId: profile.id,
              socialAccounts: [
                {
                  provider: "apple",
                  providerId: profile.id,
                  connectedAt: new Date().toISOString(),
                },
              ],
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Apple OAuth error:", error);
          return done(error);
        }
      }
    )
  );
}

export default passport;