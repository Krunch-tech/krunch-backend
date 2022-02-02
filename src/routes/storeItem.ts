import express from "express";
import { Request, Response } from "express";
import products from "../models/products";
import { lookup } from 'geoip-lite';
import barcodes from "../models/barcodes";

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    //custom product type
    if(req.body.productType==='custom') {
        const { name, picture, price, data, tags, like, category } = req.body;
        let time: any = new Date();
        time = time.toString();
        const ip = req.ip;
        const location = lookup(ip);
        const p = await products.findOne({ $and: [{ email: req.body.userInfo.email }, { name: name }] });
        
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
    
    //barcode product type
    if(req.body.productType==='bar') {
        const code = req.body.barcode;

        const p = await products.findOne({code: code});
        if(p) {
            res.status(200).json({success: false, error: 'Item with same code already exists.'});
            return;
        }
        const item =  await barcodes.findOne({barcode_number: code});
        
        //Item present in our DB
        if(item) {
            let time: any = new Date();
            time = time.toString();
            let img: String = "";
            if(item.images.length > 0) {
                img = item.images[0];
            }
            
            let prod = new products({
                userEmail: req.body.userInfo.email,
                productType: 'barcode',
                name: item.title,
                picture: img,
                data: item.description,
                time: time,
                location: location,
                like: req.body.like,
                category: item.category,
                tags: item.features
            });

            try {
                prod = await prod.save();
                const id = prod._id;
                res.status(200).json({success: true, id: id});
                return;
            } catch(e) {
                console.log(`Unable to save.\n${e}`);
                res.status(200).json({success: false, error: "Database error"});
                return;
            }
        }

        //Item not present in our DB
    }
});

export default router;