require('dotenv').config()
require('./models/dbinit')
import { Request, Response} from 'express';
import bodyParser from 'body-parser';
import express from 'express'
import singupRouter from './routes/signup';
import authorize from './middlewares/auth';
import loginRouter from './routes/login';
import facebookLogin from './routes/facebookLogin';
import productRouter from './routes/storeItem';
import getItemByCategory from './routes/getItemsByCategory';
import likedItemsRouter from './routes/getLikedItems';
import dislikedItemsRouter from './routes/getDislikedItems';
import updateNameRouter from './routes/updateName';
import updatePictureRouter from './routes/updatePicture';
import checkUser from './routes/checkUser';
import googleLogin from './routes/googleLogin';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/signup', singupRouter);
app.use('/login', loginRouter);
app.use('/facebookLogin', facebookLogin);
app.use('/storeProduct', authorize, productRouter);
app.use('/getItem/category', authorize, getItemByCategory);
app.use('/getItems/liked', authorize, likedItemsRouter);
app.use('/getItems/disliked', authorize, dislikedItemsRouter);
app.use('/updateName', authorize, updateNameRouter);
app.use('/updatePicture', authorize, updatePictureRouter);
app.use('/checkUser', checkUser);
app.use('/googleLogin', googleLogin);
app.get('/', async (req: Request, res: Response)=> {
    res.send("testing")
})

app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`);
})