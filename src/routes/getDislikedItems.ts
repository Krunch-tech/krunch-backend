import express from "express";
import { Request, Response } from "express";
import products from "../models/products";
import * as Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
import { valid } from 'joi';

const router = express.Router();

const validator = createValidator();

const querySchema = Joi.object({    
    like: Joi.boolean(),
    userInfo: Joi.object(),
});

router.get('/',validator.body(querySchema), async (req: Request, res: Response) => {

    try {
        const product = await products.find({ $and: [ {email: req.body.userInfo.email}, {like: false} ] });

        if(product.length!==0) {
            res.status(200).json({success: true, products: product});
            return;
        } else {
            res.status(200).json({success: false, error: 'No disliked items'});
            return;
        }
    } catch(e) {
        res.status(200).json({success: false, error: 'Database connectivity issue.'});
        return;
    }
    
});

export default router;