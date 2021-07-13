const mongoose = require('mongoose')
const { Schema } =  mongoose

const historyInventorySchema = new Schema({
   id: {
        type: String
   },
   user: {
        type: Object
   },
   product: {
        type: String
   },
   entry: {
        type: Number
   },
   measure: {
        type: String
   },
   price: {
        type: String
   },
   promedyPrice: {
        type: Number
   },
   provider: {
        type: String
   },
   date: {
        type: Date,
        default: Date.now
   }
})

module.exports = historyInventorySchema