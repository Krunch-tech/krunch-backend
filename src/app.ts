require('dotenv').config()
import { Request, Response} from 'express';
import express from 'express'
const app = express();


app.get('/', async (req: Request, res: Response)=> {
    res.send("testing")
})

app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`);
})