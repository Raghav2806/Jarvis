import express from 'express';
import jwt from "jsonwebtoken";
import * as serv from '../controllers/userController.js';
import passport from 'passport';

export const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/jarvis',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`https://jarvis-pink-kappa.vercel.app/auth-success?token=${token}`);
  }
);

router.post('/register', serv.register);

router.post("/login", serv.login);

router.get(
    "/dashboard", 
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        res.json({
          message:"Welcome",
          user: req.user,
        })
    }
)

router.post('/addmethod/:method',serv.addMethod)

router.get('/getmethod/:id',serv.getMethod)

router.patch('/editmethod', serv.editMethod)

router.delete('/deletemethod', serv.deleteMethod)

router.get("/ping", (req, res) => {
  res.status(200).send("OK");
});
