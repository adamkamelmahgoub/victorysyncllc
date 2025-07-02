import passport from 'passport';
import { localStrategy } from './strategies/local';

passport.use(localStrategy);

// serialize user into session
passport.serializeUser((user: any, done) => done(null, user.id));

// deserialize user from session
passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id);
  done(null, user);
});

export default passport;
