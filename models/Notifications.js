const mongoose = require('mongoose')
const { Schema } = mongoose

const notificationSchema = new Schema({
    userName: {
        type: String
    },
    userImg: {
        type: String
    },
    detail: {
        type: String
    },
    link: {
        type: String
    },
    views: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = notificationSchema