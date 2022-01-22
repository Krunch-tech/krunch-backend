import express from 'express';
import { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import users from '../models/user'
const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { userId, accessToken } = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/${userId}?fields=name,email,picture&access_token=${accessToken}`;
    let resp: any = await fetch(urlGraphFacebook, {
        method: 'GET'
    });

    resp = await resp.json();
    if (resp["error"]) {

        res.status(401).json({
            success: false,
            error: resp.error.message
        });
        return;

    }

    const email: string = resp.email!;
    const checkUser = await users.findOne({email: email});
    if (checkUser){
        res.status(401).json({
            success: false,
            error: 'User with same email already exists',
            authType: checkUser.authType
        });
        return;
    }

    let newUser = new users({
        name: resp.name,
        email: resp.email,
        picture: resp.picture.data.url,
        authType: 'facebook',
        verified: true,
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
        token: accessToken,
        authType: 'facebook'
    });
    return;

})
