const mongoose = require('mongoose')
const { Schema } = mongoose

const saleSchema = new Schema({
    branch: {
        type: String
    },
    items: {
        type: Array
    },
    client: {
        type: Object
    },
    localGain: {
        type: Number
    },
    typesPay: {
        type: Array
    },
    count: {
        type: Number
    },
    origin: {
        type: String
    },
    status: {
        type: Boolean
    },
    shipping: {
        type: Number
    },
    uuid: {
        type: Number
    },
    totals: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = saleSchema