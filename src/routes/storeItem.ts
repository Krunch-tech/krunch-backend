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
    }
});

export default router;