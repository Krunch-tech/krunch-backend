import express from "express";
import { Request, Response } from "express";
import users from "../models/user";
import * as Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
import { valid } from 'joi';

const router = express.Router();

const validator = createValidator();

const querySchema = Joi.object({    
    name: Joi.string().required(),
});

router.post('/', validator.body(querySchema), async (req: Request, res: Response) => {

    let user = await users.findOne({ email: req.body.userInfo.email });
    if(!user) {
        res.status(200).json({success: false, error: "User not found"});
        return;
    }

    user.name = req.body.name;
    try {
        user = await user.save();
        res.status(200).json({success: true});
        return;
    } catch (e) {
        res.status(500).json({success: false, error: "Internal server error"});
    }

});

export default router;