import express from 'express'
import config from './config';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import shortid from 'shortid';

dotenv.config();

const app = express();
app.use(bodyparser.json());

// make connection config
const mongodbUrl = config.MONGODB_URL
mongoose.connect(mongodbUrl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch( error => console.log(error.reason));
// make model product

const Product = mongoose.model(
    'products',
    new mongoose.Schema({
        _id:{type:String,default:shortid.generate},
        title:String,
        description:String,
        image:String,
        price:Number,
        availableSizes:[String],
    })
)

app.get('/api/products',async (req,res) =>{
    const products = await Product.find({});
    res.send(products)
})

app.post('/api/products',async (req,res) =>{
    const newProduct = new Product(req.body);
    const saveProduct = await newProduct.save();
    res.send(saveProduct);
})

app.delete('/api/products/:id',async (req,res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
})

const Order = mongoose.model('orders',new mongoose.Schema({
    _id:{
        type:String,
        default:shortid.generate
    },
    email:String,
    name:String,
    address:String,
    total:Number,
    cartItems:[
        {
        _id:String,
        title:String,
        price:Number,
        count:Number
        },
    ],
  },
  {
    timestamps:true
  }
))

app.post('/api/orders',async(req,res) => {
    if(!req.body.name || !req.body.email || !req.body.address || !req.body.total || !req.body.cartItems){
        return res.send({message:'Data is required.'})
    }
    const order = await Order(req.body).save();
    res.send(order);
})
app.listen(config.PORT,()=>{
    console.log(`server started at http://localhost:${config.PORT}`)
})