require('dotenv').config()
require('./models/dbinit')
import { Request, Response} from 'express';
import bodyParser from 'body-parser';
import express from 'express'
import singupRouter from './routes/signup';
import authorize from './middlewares/auth';
import loginRouter from './routes/login';
import productRouter from './routes/storeItem';
import getItemByCategory from './routes/getItemsByCategory';


const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/signup', singupRouter);
app.use('/login', loginRouter);
app.use('/storeProduct', authorize, productRouter);
app.use('/getItem/category', authorize, getItemByCategory);
app.get('/', authorize, async (req: Request, res: Response)=> {
    res.send("testing")
})

app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`);
})