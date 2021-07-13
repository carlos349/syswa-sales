const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema ({
    access: {
        type: Array
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: String
    },
    lastAccess: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = userSchema