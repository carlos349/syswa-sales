const express = require('express')
const dates = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const datesSchema = require('../models/Dates')
const cors = require('cors')

dates.use(cors())

dates.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Datee = conn.model('dates', datesSchema)

    try {
        const getDates = await Datee.find()
        res.json({status: 'ok', data: getDates})
    }catch(err){
        res.send(err)
    }
})

module.exports = dates