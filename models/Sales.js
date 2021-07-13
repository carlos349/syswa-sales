const mongoose = require('mongoose')
const { Schema } = mongoose

const saleSchema = new Schema({
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
    status: {
        type: Boolean
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