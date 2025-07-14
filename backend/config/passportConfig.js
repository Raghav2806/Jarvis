import passport from "passport";
import {Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import {findUserByEmail, findUserByGoogleId} from "../repositries/userRepo.js"
import userModel from "../models/userModel.js";
import * as dotenv from "dotenv";
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await findUserByEmail(jwt_payload.email);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://jarvis-qynk.onrender.com/auth/google/jarvis",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user= await findUserByGoogleId(profile.id)
        if (!user) {
          await userModel.create({email:profile.emails[0].value,name:profile.displayName,imageUrl:profile.photos[0].value,googleId:profile.id});
          const newUser= await findUserByEmail(profile.emails[0].value);
          return cb(null, newUser);
        } else {
          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});