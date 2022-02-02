import express from 'express';
import { Request, Response, Router } from 'express';
import axios from 'axios';
import users from '../models/user'
const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { userid, accesstoken } = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/${userid}?fields=name,email,picture&access_token=${accesstoken}`;
    let resp: any = await axios.get(urlGraphFacebook);
    if (resp["error"]) {

        res.status(401).json({
            success: false,
            error: resp.error.message
        });
        return;

    }
    resp = await resp.data;
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
        token: accesstoken,
        authType: 'facebook'
    });
    return;

});
export default router;
