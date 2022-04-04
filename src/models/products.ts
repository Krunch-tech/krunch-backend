import mongoose from 'mongoose'

const products = mongoose.model('products', new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    productType: {
        type: String,
        required: true,
        enum: ['barcode', 'custom']
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    picture: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        default: "0.0",
        trim: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
    },
    location: {
        type: Array,
    },
    like: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        trim: true,
    },
    code: {
        type: Number,
    }
}));

export default products;