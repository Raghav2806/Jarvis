import express from 'express';
import jwt from "jsonwebtoken";
import * as serv from '../controllers/userController.js';
import passport from 'passport';

export const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/jarvis', passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}),(req,res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
    res.json({token});
});

router.post('/register', serv.register);

router.post("/login", serv.login);

router.get(
    "/dashboard", 
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        res.json({message:"Welcome"})
    }
)