const mongoose = require('mongoose')
const { Schema } = mongoose

const daySaleSchema = new Schema({
    items: {
        type: Array
    },
    typesPay: {
        type: Array
    },
    total: {
        type: Number
    },
    idTableSales: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = daySaleSchema