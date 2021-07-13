const express = require('express')
const products = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const productSchema = require('../models/Products')
const storeSchema = require('../models/Store')
const historyProductionSchema = require('../models/HistoryProduction')
const cors = require('cors')

products.use(cors())

products.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)

    try {
        const getProducts = await Product.find()
        if(getProducts.length > 0){
            res.json({status: 'ok', data: getProducts, token: req.requestToken})
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){res.send(err)}
})

products.get('/getHistory', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryProduction = conn.model('historyProductions', historyProductionSchema)

    try {
        const getHistory = await HistoryProduction.find().sort({createdAt: -1})
        if(getHistory.length > 0){
            res.json({status: 'ok', data: getHistory, token: req.requestToken})
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){res.send(err)}
})

products.get('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)

    try {
        const getProducts = await Product.findById(req.params.id)
        if(getProducts){
            res.json({status: 'ok', data: getProducts, token: req.requestToken})
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){res.send(err)}
})

products.post('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)

    const data = {
        product: req.body.product,
        quantityProduction: req.body.quantityProduction,
        quantity: 0,
        consume: 0,
        price: req.body.price,
        rawMaterial: req.body.rawMaterial,
        createdAt: new Date()
    }

    try {
        const findProduct = await Product.findOne({product: data.product})
        if (findProduct) {
            res.json({status: 'bad', token: req.requestToken})
        }else{
            try {
                const createProduct = await Product.create(data)
                if (createProduct) {
                    res.json({status: 'ok', token: req.requestToken})
                }
            }catch(err){
                res.send(err)
            }
        }
    }catch(err){
        res.send(err)
    }
})

products.post('/addProduction/:id', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)
    const Store = conn.model('stores', storeSchema)
    const HistoryProduction = conn.model('historyProductions', historyProductionSchema)

    const product = req.body.product
    const quantity = req.body.quantity

    const dataProduction = {
        product: product.product,
        produced: quantity,
        createdAt: new Date()
    }
    
    Product.findByIdAndUpdate(req.params.id, {
        $inc: {
            quantity: parseFloat(quantity)
        }
    }).then(editProduct => {
        if (editProduct) {
            for (const material of product.rawMaterial) {
                var consume = 0
                consume = ((parseFloat(quantity) / product.quantityProduction) * parseFloat(material.quantity))
                Store.findByIdAndUpdate(material.id, {
                    $inc: {
                        consume: consume
                    }
                }).then(ready => {})
            }
            HistoryProduction.create(dataProduction)
            .then(createHistory => {
                res.json({status: 'ok', token: req.requestToken}) 
            }).catch(err => res.send(err))
        }
    }).catch(err => res.send(err))
})

products.put('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)

    try {
        const editProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: {
                product: req.body.product,
                quantityProduction: req.body.quantityProduction,
                price: req.body.price,
                rawMaterial: req.body.rawMaterial
            }
        })
        if (editProduct) {
            res.json({status: 'ok', token: req.requestToken}) 
        }
    }catch(err){
        res.send(err)
    }
})

products.delete('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Product = conn.model('products', productSchema)

    try {
        const deleteProduct = await Product.findByIdAndRemove(req.params.id)
        if (deleteProduct) {
            res.json({status: 'ok', token: req.requestToken}) 
        }
    }catch(err){
        res.send(err)
    }
})

module.exports = products