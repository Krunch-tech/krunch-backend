import express from "express";
import { Request, Response } from "express";
import users from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    if (!(typeof req.body.email === 'string' && typeof req.body.password === 'string')) {
        res.status(400);
        res.json({success: false, error: 'Email and password should be string'});
        return;
    }

    if (req.body.email.length > 150 || req.body.password.length > 150) {
        res.status(400);
        res.json({success: false, error: 'Spam detected'});
        return;
    }

    const user = await users.findOne({ email: req.body.email });
    if(!user) {
        res.status(200);
        res.json({success: false, error: 'User does not exist.'});
        return;
    }
    const check = await bcrypt.compare(req.body.password, user.password);
    const secret: string = process.env.JWT_SECRET!;

    if (check) {
        const token = jwt.sign({email: user.email}, secret, {expiresIn: process.env.JWT_EXPIRY});
        res.status(200);
        res.json({success: true, error: null, token: token, authType: 'custom'});
        return;
    }

    res.status(200);
    res.json({success: false, error: 'Invalid login credentials'});
});

export default router;