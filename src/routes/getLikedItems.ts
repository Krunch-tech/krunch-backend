import express from "express";
import { Request, Response } from "express";
import products from "../models/products";

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    try {
        const product = await products.find({ $and: [ {email: req.body.userInfo.email}, {like: true} ] });

        if(product.length!==0) {
            res.status(200).json({success: true, products: product});
            return;
        } else {
            res.status(200).json({success: false, error: 'No liked items'});
            return;
        }
    } catch(e) {
        res.status(200).json({success: false, error: 'Database connectivity issue.'});
        return;
    }
    
});

export default router;