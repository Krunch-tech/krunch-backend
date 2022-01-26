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
        trim: true,
    },
    data: {
        type: Date,
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
        type: Location,
    },
    like: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        trim: true,
    }
}));

export default products;