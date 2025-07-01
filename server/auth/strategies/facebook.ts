import passport from "../passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { storage } from "../../storage";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "name", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName + " " + profile.name?.familyName || "Facebook User";

          if (!email) {
            return done(new Error("No email found in Facebook profile"));
          }

          // Check if user already exists
          let user = await storage.getPublicUserByEmail(email);

          if (user) {
            // Update social accounts if not already connected
            const socialAccounts = Array.isArray(user.socialAccounts) ? user.socialAccounts : [];
            const hasFacebook = socialAccounts.some((account: any) => account.provider === "facebook");
            
            if (!hasFacebook) {
              socialAccounts.push({
                provider: "facebook",
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
              provider: "facebook",
              providerId: profile.id,
              socialAccounts: [
                {
                  provider: "facebook",
                  providerId: profile.id,
                  connectedAt: new Date().toISOString(),
                },
              ],
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Facebook OAuth error:", error);
          return done(error);
        }
      }
    )
  );
}

export default passport;