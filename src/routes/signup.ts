import express from 'express'
import { Request, Response} from 'express';
import users from '../models/user';

export const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    if (!(typeof req.body.email === 'string' && typeof req.body.password === 'string')) {
        res.status(400);
        res.json({success: false, error: 'Email and password should be string'});
        return;
    }

    if (req.body.email.length > 150 || req.body.password.length > 150 || req.body.username.length > 150) {
        res.status(400);
        res.json({success: false, error: 'Spam detected'});
        return;
    }

    const user = await users.findOne({ email: req.body.email });

    if(user){
        res.status(200);
        res.json({success: false, error: 'Email already exists'});
    }
    
})