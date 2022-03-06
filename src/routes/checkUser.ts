import express from "express";
import { Request, Response } from "express";
import users from "../models/user";
import * as Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'

const router = express.Router();

const validator = createValidator();

const querySchema = Joi.object({    
    email: Joi.string().required(),
});

router.post('/', validator.body(querySchema), async (req: Request, res: Response) => {

    try {
        let user = await users.findOne({ email: req.body.email });
        if(!user) {
            res.status(200).json({success: false, error: "User not found"});
            return;
        } else {
            res.status(200).json({success: true});
            return;
        }
    } catch (e) {
        res.status(500).json({success: false, error: "Internal server error"});
        return;
    }
});

export default router;