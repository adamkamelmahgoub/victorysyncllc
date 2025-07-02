// server/auth/strategies/local.ts
import { Strategy as LocalStrategy } from 'passport-local';

export const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    const user = await findUserByEmail(email);
    if (!user) return done(null, false, { message: 'User not found' });

    if (!user.isVerified) {
      return done(null, false, { message: 'Email not verified' });
    }

    const validPassword = await checkPassword(user, password);
    if (!validPassword) return done(null, false, { message: 'Invalid credentials' });

    return done(null, user);
  }
);
