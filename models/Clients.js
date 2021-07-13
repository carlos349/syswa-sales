const mongoose = require('mongoose')
const { Schema } = mongoose

const clientSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Object
    },
    instagram: {
        type: String
    },
    lastAttend: {
        type: Date
    },
    createdAt: {
        type: Date
    }
})

module.exports = clientSchema