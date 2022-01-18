import mongoose from 'mongoose'

const users = mongoose.model('users', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    authType: {
        type: String,
        required: true,
        enum: ['custom', 'google', 'apple', 'facebook']
    },
    name: {
        type: String,
        required: true,
        trim: true,
    }
}));

export default users;