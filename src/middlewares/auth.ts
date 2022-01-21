import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { Next } from '../Types/type'

const authorize = (req: Request, res: Response, next: Next) => {
    const type = req.headers.authtype;
    console.log(type);
    if (type==='custom'){

        const token: any = req.headers['x-access-token'] || req.headers.authorization;

        if(!token){
            res.status(401).json({
                success: 'false',
                error: 'Unauthorized',
            });
            return;
        }

        try {
            const secret: string = process.env.JWT_SECRET!
            req.body.userInfo = jwt.verify(token, secret);
            next();
        } catch (e) {
            res.status(400).json({
                success: false,
                error: 'Invalid JWT'
            });
            return
        }
    }
};

export default authorize;