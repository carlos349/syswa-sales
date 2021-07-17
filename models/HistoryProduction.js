const mongoose = require('mongoose')
const { Schema } = mongoose

const historyProductionSchema = new Schema({
    product: {
        type: String
    },
    produced: {
        type: Number,
    },
    type: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = historyProductionSchema