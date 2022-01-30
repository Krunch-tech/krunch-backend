import express from "express";
import { Request, Response } from "express";
import products from "../models/products";
import { lookup } from 'geoip-lite';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    if(req.body.productType==='custom') {
        const { name, picture, price, data, tags, like, category } = req.body;
        let time: any = new Date();
        time = time.toString();
        const ip = req.ip;
        const location = lookup(ip);
        const p = await products.find({ $and: [{ email: req.body.userInfo.email }, { name: name }] });
        
        if (p) {
            res.status(200).json({success: false, error: 'Item with name already exists.'});
            return;
        }

        let product = new products({
            userEmail: req.body.userInfo.email,
            productType: 'custom',
            name: name,
            picture: picture,
            data: data,
            time: time,
            location: location,
            like: like,
            category: category,
            tags: tags
        });

        try {
            product = await product.save();
            const id = product._id;
            res.status(200).json({success: true, id: id});
            return;
        } catch(e) {
            console.log(`Unable to save.\n${e}`);
            res.status(200).json({success: false, error: "Database error"});
            return;
        }
    }
});

export default router;