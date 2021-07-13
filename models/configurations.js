const mongoose = require('mongoose')
const { Schema } = mongoose

const configurationSchema = new Schema({
    businessName: {
        type: String
    },
    businessPhone: {
        type: Object
    },
    businessType: { 
        type: String
    },
    businessLocation: {
        type: String
    },
    typesPay: {
        type: Array
    },
    currency: {
        type: String
    }
})

module.exports = configurationSchema