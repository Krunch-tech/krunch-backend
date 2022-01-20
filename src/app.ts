require('dotenv').config()
require('./models/dbinit')
import { Request, Response} from 'express';
import bodyParser from 'body-parser';
import express from 'express'
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', async (req: Request, res: Response)=> {
    res.send("testing")
})

app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`);
})