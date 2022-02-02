import mongoose from 'mongoose'

const barcodes = mongoose.model('barcodes', new mongoose.Schema({
    barcode_number: {
        type: Number,
    },
    barcode_type: {
        type: String
    },
    barcode_formats: {
        type: String,
    },
    mpn: {
        type: String,
    },
    model: {
        type: String,
    },
    asin: {
        type: String,
    },
    title: {
        type: String,
    },
    category: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    brand: {
        type: String,
    },
    contributors: {
        type: Array,
    },
    age_group: {
        type: String,
    },
    ingredients: {
        type: String,
    },
    nutrition_facts: {
        type: String,
    },
    energy_efficiency_class: {
        type: String,
    },
    color: {
        type: String,
    },
    gender: {
        type: String,
    },
    material: {
        type: String,
    },
    patern: {
        type: String,
    },
    format: {
        type: String,
    },
    multipack: {
        type: String,
    },
    size: {
        type: String,
    },
    length: {
        type: String,
    },
    width: {
        type: String,
    },
    weight: {
        type: String,
    },
    release_date: {
        type: String,
    },
    description: {
        type: String,
    },
    features: {
        type: Array,
    },
    images: {
        type: Array,
    },
    last_update: {
        type: String,
    },
    stores: {
        type: Array,
    },
    reviews: {
        type: Array,
    }
}));

export default barcodes;