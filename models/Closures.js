const mongoose = require('mongoose')
const { Schema } = mongoose

const closureSchema = new Schema({
    manual: {
        type: Array
    },
    system: {
        type: Array
    },
    closerName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = closureSchema