const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    product: {
        type: String
    },
    quantityProduction: {
        type: Number
    },
    quantity: {
        type: Number
    },
    consume: {
        type: Number
    },
    price: {
        type: Number
    },
    rawMaterial: {
        type: Array
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = productSchema