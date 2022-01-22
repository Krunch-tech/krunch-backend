import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { Next } from '../Types/type'
import fetch from 'node-fetch';
import users from '../models/user';

const authorize = async (req: Request, res: Response, next: Next) => {
    const type = req.headers.authtype;
    console.log(type);
    if (type==='custom'){

        const token: any = req.headers['x-access-token'] || req.headers.authorization;

        if(!token){
            res.status(400).json({
                success: 'false',
                error: 'Bad request',
            });
            return;
        }

        try {
            const secret: string = process.env.JWT_SECRET!
            req.body.userInfo = jwt.verify(token, secret);
            next();
        } catch (e) {
            res.status(401).json({
                success: false,
                error: 'Invalid JWT'
            });
            return
        }
    }

    if (type==='facebook') {

        const { userId, accessToken } = req.headers;
        if(!userId || !accessToken) {
            res.status(400).json({
                success: 'false',
                error: 'Bad Request',
            });
            return;
        }

        let urlGraphFacebook = `https://graph.facebook.com/${userId}?fields=name,email,picture&access_token=${accessToken}`;
        let resp: any = await fetch(urlGraphFacebook, {
            method: 'GET'
        });

        const user = await users.findOne({email: resp.email});
        if(!user){
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }
        const userInfo = {
            email: user.email,
        }
        req.body.userInfo = userInfo;
        next();
    }
};

export default authorize;