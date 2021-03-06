import express from 'express'
import { Request, Response} from 'express';
import users from '../models/user';
import hashPassword from '../tools/hash';
import jwt from 'jsonwebtoken'
import * as Joi from 'joi';
import {
    createValidator
  } from 'express-joi-validation'
import { valid } from 'joi';

const router = express.Router();

const validator = createValidator()

const querySchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  picture: Joi.string()
});


router.post('/',validator.body(querySchema), async (req: Request, res: Response) => {


    if (!(typeof req.body.email === 'string' && typeof req.body.password === 'string')) {
        res.status(400);
        res.json({success: false, error: 'Email and password should be string'});
        return;
    }

    if (req.body.email.length > 150 || req.body.password.length > 150 ) {
        res.status(400);
        res.json({success: false, error: 'Spam detected'});
        return;
    }

    const user = await users.findOne({ email: req.body.email });

    if(user){
        res.status(200);
        res.json({success: false, error: 'Email already exists'});
        return;
    }

    let newUser =new users ({
        email: req.body.email,
        password: await hashPassword(req.body.password),
        name: req.body.name,
        authType: 'custom',
        picture: req.body.picture
    });

    try {
        newUser = await newUser.save();
    } catch (e) {
        console.error(`Error occurred: ${e}`);
        res.status(500)
        res.json({success: false, error: 'Unable to save.'});
        return;
    }

    const secret: string = process.env.JWT_SECRET!;
    const token = jwt.sign({email: newUser.email}, secret, {expiresIn: process.env.JWT_EXPIRY});

    res.status(200);
    res.json({success: true, error: null, token: token, authType: 'custom'});
    return;
});

export default router;