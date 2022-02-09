import express from "express";
import { Request, Response } from "express";
import users from "../models/user";

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {

    let user = await users.findOne({ email: req.body.userInfo.email });
    if(!user) {
        res.status(200).json({success: false, error: "User not found"});
        return;
    }

    user.picture = req.body.picture;
    try {
        user = await user.save();
        res.status(200).json({success: true});
        return;
    } catch (e) {
        res.status(500).json({success: false, error: "Internal server error"});
    }

});

export default router;