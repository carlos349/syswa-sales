const mongoose = require('mongoose')
const { Schema } = mongoose

const datesSchema = new Schema({
    branch: {
        type: String
    },
    start: {
        type: String
    },
    end: {
        type: String
    },
    sort: {
        type: Number
    },
    title: {
        type: String
    },
    products: {
        type: Array
    },
    duration: {
        type: Number
    },
    content: {
        type: String
    },
    client: {
        type: Object
    },
    class: {
        type: String
    },
    process: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = datesSchema