import express from 'express';
import { Request, Response, Router } from 'express';
import axios from 'axios';
import users from '../models/user'
import * as Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'

const router: Router = express.Router();

const validator = createValidator();

const querySchema = Joi.object({    
    accesstoken: Joi.string().required(),
});

router.post('/', validator.body(querySchema), async (req: Request, res: Response) => {
    const access_token: string = req.body.accesstoken;
    const googleOAuthURL = 'https://www.googleapis.com/oauth2/v2/userinfo';

    try {
        let resp: any = await axios.get(googleOAuthURL, {
            headers: {
                Authorization: 'Bearer '+access_token
            }
        });

        const data = await resp.data;
        const checkUser = await users.findOne({email: data.email});

        if (checkUser){
            res.status(401).json({
                success: false,
                error: 'User with same email already exists',
                authType: checkUser.authType
            });
            return;
        };

        let newUser = new users({
            name: data.name,
            email: data.email,
            picture: data.picture,
            authType: 'google',
            verified: data.verified_email,
        });

        try {
            newUser = await newUser.save();
        } catch(e) {
            res.status(500).json({
                success: false,
                error: 'Unable to save.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            error: null,
            token: access_token,
            authType: 'google'
        });
        return;

    } catch (e) {
        res.status(500).json({
            success: false,
            error: 'Internal server error.'
        });
    }
});

export default router;