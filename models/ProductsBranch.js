const mongoose = require('mongoose')
const { Schema } = mongoose

const productBranchSchema = new Schema({
    branch: {
        type: String
    },
    product: {
        type: String
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
    idInventory: {
        type: String  
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = productBranchSchema