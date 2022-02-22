import express from "express";
import { Request, Response } from "express";
import products from "../models/products";
import { lookup } from 'geoip-lite';
import barcodes from "../models/barcodes";
import axios from "axios";
import downloadImage from "../tools/downloadImage";
import * as Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
import { valid } from 'joi';

const router = express.Router();

const validator = createValidator();

const querySchema = Joi.object({
    name: Joi.string().required(),
    picture: Joi.string(),
    price: Joi.string(),
    data: Joi.date(),
    tags: Joi.array(),
    like: Joi.boolean(),
    category: Joi.string(),
    userInfo: Joi.object(),
    bar: Joi.string()
});

router.post('/',validator.body(querySchema), async (req: Request, res: Response) => {


    //custom product type
    if(req.body.productType==='custom') {
        const { name, picture, price, data, tags, like, category } = req.body;
        
        const p = await products.findOne({ $and: [{ email: req.body.userInfo.email }, { name: name }] });
        
        if (p) {
            res.status(200).json({success: false, error: 'Item with name already exists.'});
            return;
        }

        let time: any = new Date();
        time = time.toString();
        const ip = req.ip;
        const location = lookup(ip);

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
            tags: tags,
            price: price
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

            let img: String = "";
            if(item.images.length > 0) {
                img = item.images[0];
            }
            
            let time: any = new Date();
            time = time.toString();
            const ip = req.ip;
            const location = lookup(ip);

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
                tags: item.features,
                code: item.barcode_number
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
        const url = `https://api.barcodelookup.com/v3/products?barcode=${code}&formatted=y&key=${process.env.BARCODE_API_KEY}`;
        let resp: any = await axios.get(url);
        if(resp.status!=200) {
            res.status(400).json({
                success: false,
                error: `Barcode invalid`
            });
            return;
        }
        resp = resp.data;
        let barProducts = new barcodes(resp.products[0]);
        let barcode_number: any = resp[0].products[0].barcode_number;
        let img: string = '';

        if(item.images.length > 0) {
            img = item.images[0]!;
        }

        let time: any = new Date();
        time = time.toString();
        const ip = req.ip;
        const location = lookup(ip);

        try {
            barProducts = await barProducts.save();
            let prod = new products({
                userEmail: req.body.userInfo.email,
                productType: 'barcode',
                name: barProducts.title,
                picture: img,
                data: barProducts.description,
                time: time,
                location: location,
                like: req.body.like,
                category: barProducts.category,
                tags: barProducts.features
            });

            prod = await prod.save();
            const id = prod._id;
            res.status(200).json({success: true, id: id});
            await downloadImage(img, barcode_number.toString())
            return;
            
        } catch(e) {
            console.log(`Unable to save barcode.\n${e}`);
            res.status(200).json({success: false, error: "Database error"});
            return;
        }
        
    }
});

export default router;