const mongoose = require('mongoose')
const { Schema } = mongoose

const cashfundSchema = new Schema({
    userRegister: {
        type: String
    },
    amount: {
        type: Number
    },
    amountEgress: {
        type: Number
    },
    quantity: {
        type: Number
    },
    validator: {
        type: Boolean
    }
})

module.exports = cashfundSchema