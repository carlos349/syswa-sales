const express = require('express')
const stores = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const inventorySchema = require('../models/Inventory')
const storeSchema = require('../models/Store')
const providerSchema = require('../models/Providers')
const historyInventorySchema = require('../models/HistoryInventories')
const historyClosedInventorySchema = require('../models/HistoryClosedInventories')
const cors = require('cors')

stores.use(cors())

//Api que busca todos los datos de los productos de la bodega (Ingreso: Nullo) -- Api that search all the products´ data of the store (Input: Null)

stores.get('/getstore', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    try{
        const getStore = await Store.find()
        if (getStore.length > 0 ) {
            res.json({status: 'ok', data: getStore, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }catch(err){
        res.send(err)
    }
})

stores.get('/alertProducts', (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    var productsToAlert = []
    Store.find()
    .then(products => {
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            const total = (parseFloat(product.entry) + parseFloat(product.quantity)) - parseFloat(product.consume)
            if (total <= product.alertTotal) {
                productsToAlert.push({total: total, nameProduct: product.producto})
            }            
        }
        if (productsToAlert.length > 0) {
            res.json({status: 'ok', productsToAlert: productsToAlert})
        }else{
            res.json({status: 'bad'})
        }
    })
    .catch(err => {
        res.send(err)
        console.log(err)
    })
})


//Final de la api. (Retorna: Datos de productos) -- Api end. (Return: Products´ data)

//--------------------------------------------------------------------------------------

//Api que busca los datos de lun producto de la bodega (Ingreso: ObjectId del producto) -- Api that search a product's data of the store (Input: poduct's ObjectId)

stores.get('/getstorebyid/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    try{
        const getStore = await Store.findById(req.params.id)
        if (getStore) {
            res.json({status: 'ok', data: getStore, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos de productos) -- Api end. (Return: Products´ data)

//--------------------------------------------------------------------------------------

//Api que busca los datos de lun producto de la bodega (Ingreso: ObjectId del producto) -- Api that search a product's data of the store (Input: poduct's ObjectId)

stores.get('/getinventorybyid/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    try{
        const findProduct = await Inventory.findById(req.params.id)
        if (findProduct) {
            res.json({status: 'ok', data: findProduct, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }catch(err){
        res.send(err)
    }
})


//Final de la api. (Retorna: Datos de productos) -- Api end. (Return: Products´ data)

//--------------------------------------------------------------------------------------

//Api que busca los productos por sucursal (Input: branch) -- Api that search products by branch (Input: branch)

stores.get('/getinventorybybranch', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    try{
        const getInventoryByBranch = await Inventory.find()
        if (getInventoryByBranch.length > 0) {
            res.json({status: 'ok', data: getInventoryByBranch, token: req.requestToken})
        }else{
            res.json({status: 'inventories not found'})
        }
    }catch(err){
        res.json(err)
    }
})


//Final de la api. (Retorna: Datos de productos) -- Api end. (Return: Products´ data)

//--------------------------------------------------------------------------------------

//Api que busca los productos por sucursal (Input: branch) -- Api that search products by branch (Input: branch)

stores.get('/getproductsales', protectRoute, async (req, res) => { 
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    try{
        const getInventoryByBranch = await Inventory.find({
            $and:[
                {productType: 'Venta'}
            ]
        })

        if (getInventoryByBranch.length > 0) {
            res.json({status: 'ok', data: getInventoryByBranch, token: req.requestToken})
        }else{
            res.json({status: 'inventories not found'})
        }
    }catch(err){
        res.json(err)
    }
})

stores.get('/getinventorybybranchforservice', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    try{
        const getInventoryByBranch = await Inventory.find({
            $and: [
                {productType: 'Materia prima'}
            ]
        })
        
        if (getInventoryByBranch.length > 0) {
            res.json({status: 'ok', data: getInventoryByBranch, token: req.requestToken})
        }else{
            res.json({status: 'inventories not found'})
        }
    }catch(err){
        res.json(err)
    }
})

//Final de la api. (Retorna: Datos del inventario de la sucursal) -- Api end. (Return: inventory´s data of the branch)

//--------------------------------------------------------------------------------------

//Api que busca los provedores (Ingreso: Null) -- Api that search providers (Input: Null)

stores.get('/getproviders', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Provider = conn.model('providers', providerSchema)

    try{
        const getProviders = await Provider.find()
        if (getProviders.length > 0) {
            res.json({status: 'ok', data: getProviders, token: req.requestToken})
        }else{
            res.json({status: 'providers not found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos de los provedores) -- Api end. (Return: Providers´ data)

//--------------------------------------------------------------------------------------

//Api que busca el historial de la bodega. (Ingreso: Null) -- Api that search store´s history. (Input: Null)

stores.get('/getstorehistory', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const History = conn.model('historyInventories', historyInventorySchema)

    try{
        const getHistory = await History.find()
        if (getHistory.length > 0) {
            res.json({status: 'ok', data: getHistory, token: req.requestToken})
        }else{
            res.json({status: 'history not found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial de la bodega) -- Api end. (Return: Store history´s data)

//--------------------------------------------------------------------------------------

//Api que busca el historial por sucursal (Input: branch) -- Api that search history by branch (Input: branch)

stores.get('/gethistorybybranch', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const History = conn.model('historyInventories', historyInventorySchema)

    try{
        const historyByBranch = await History.find()
        if (historyByBranch.length > 0) {
            res.json({status: 'ok', data: historyByBranch, token: req.requestToken})
        }else{
            res.json({status: 'history not found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial de la sucursal) -- Api end. (Return: branch history´s data)

//--------------------------------------------------------------------------------------

//Api que busca el historial por sucursal (Input: branch) -- Api that search history by branch (Input: branch)

stores.get('/gethistoryclosedbybranch', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryClosed = conn.model('historyClosedInventories', historyClosedInventorySchema)

    try{
        const historyByBranch = await HistoryClosed.find()
        if (historyByBranch.length > 0) {
            res.json({status: 'ok', data: historyByBranch, token: req.requestToken})
        }else{
            res.json({status: 'history not found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial de la sucursal) -- Api end. (Return: branch history´s data)

//--------------------------------------------------------------------------------------

//Api que busca el historial por sucursal (Input: branch) -- Api that search history by branch (Input: branch)

stores.get('/gethistoryclosedbyid/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryClosed = conn.model('historyClosedInventories', historyClosedInventorySchema)

    try{
        const historyById = await HistoryClosed.findById(req.params.id)
        res.json({status: 'ok', data: historyById, token: req.requestToken})
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial de la sucursal) -- Api end. (Return: branch history´s data)

//--------------------------------------------------------------------------------------

//Api que busca el historial por sucursal (Input: branch) -- Api that search history by branch (Input: branch)

stores.get('/getstoreclosed', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryClosed = conn.model('historyClosedInventories', historyClosedInventorySchema)

    try{
        const historyByBranch = await HistoryClosed.find()
        console.log(historyByBranch)
        if (historyByBranch.length > 0) {
            res.json({status: 'ok', data: historyByBranch, token: req.requestToken})
        }else{
            res.json({status: 'history not found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial de la sucursal) -- Api end. (Return: branch history´s data)

//--------------------------------------------------------------------------------------

//Api que edita un producto de la bodega (Input: ObjectId del producto ,product, measure, price) -- Api that edit a product in the store (Input: product´s ObjectId, product, measure, price)

stores.put('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)
    const Inventory = conn.model('inventories', inventorySchema)

    Store.findById(req.params.id)
    .then(found => {
        Store.find({product:req.body.product})
        .then(storeFind => {
            if (found.product != req.body.product && storeFind.length > 0) {
                res.json({status: 'product already in use'})
            }else{
                Store.findByIdAndUpdate(req.params.id, {
                    $set: {
                        product: req.body.product,
                        measure: req.body.measure,
                        price: req.body.price,
                        alertTotal: req.body.alertTotal
                    }
                })
                .then(storeEdited => {
                    Inventory.updateMany( {storeId: req.params.id}, {
                        $set: {
                            product: req.body.product,
                            measure: req.body.measure,
                            price: req.body.price 
                        }  
                    })
                    .then(finalRes => {
                        res.json({status: 'store edited', data: storeEdited, token: req.requestToken})
                    }).catch(err => {
                        res.send(err)
                    })
                }).catch(err => {
                    res.send(err)
                })
            }
        }).catch(err => {
            res.send(err)
        })
    }).catch(err => {
        res.send(err)
    })
})

//Final de la api. (Retorna: Datos del producto) -- Api end. (Return: product´s data)

//--------------------------------------------------------------------------------------

//Api que edita un provedor (Ingreso: ObjectId del provedor ,name, document, contact, contactPlus, location) -- Api that edit a product in the store (Input: Provider´s ObjectId ,name, document, contact, contactPlus, location)

stores.put('/updateprovider/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Provider = conn.model('providers', providerSchema)

    Provider.findById(req.params.id)
    .then(found => {
        Provider.find({document:req.body.document})
        .then(providerFind => {
            if (found.document != req.body.document && providerFind.length > 0) {
                res.json({status: 'provider already exist'})
            }else{
                Provider.findByIdAndUpdate(req.params.id, {
                    $set: {
                        name: req.body.name,
                        document: req.body.document,
                        contact: req.body.contact,
                        contactPlus: req.body.contactPlus,
                        location: req.body.location
                    }
                })
                .then(providerEdited => {
                    res.json({status: 'provider edited', data: providerEdited, token: req.requestToken})
                }).catch(err => {
                    res.send(err)
                })
            }
        }).catch(err => {
            res.send(err)
        })
    }).catch(err => {
        res.send(err)
    })
})

stores.put('/discountProductStore/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)
    const History = conn.model('historyInventories', historyInventorySchema)

    const historical = {
        id: req.params.id,
        branch: req.body.branch,
        user: {
            firstName: req.body.firstNameUser,
            lastName: req.body.lastNameUser,
            email: req.body.emailUser
        },
        price: parseFloat(req.body.productPromedy) * parseFloat(req.body.quantity),
        promedyPrice: req.body.productPromedy,
        provider: 'Bodega',
        product: req.body.product,
        entry: req.body.quantity,
        measure: req.body.measure,
        date: new Date()
    }
    try{
        const discountStore = await Store.findByIdAndUpdate(req.params.id, {
            $inc: {
                quantity: parseFloat('-'+req.body.quantity)
            }
        })
        if (discountStore) {
            try {
                const registerHistory = await History.create(historical)
                res.json({status: 'ok', token: req.requestToken}) 
            }catch(err){
                res.send(err)
            }
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del provedor) -- Api end. (Return: Provider´s data)

//--------------------------------------------------------------------------------------

//Api que agrega cantidades a un producto (Ingreso: ObjectId del producto, user´s ObjectId, nameUser, documentUser, product, entry, date, price, provider) -- Api that add quantity to a product (Input: Product´s ObjectId, user´s ObjectId, nameUser, documentUser, product, measure, entry, date, price, provider)

stores.put('/add/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)
    const History = conn.model('historyInventories', historyInventorySchema)

    const historical = {
        id: req.params.id,
        user: {
            id: req.body.history.idUser,
            firstName: req.body.history.firstNameUser,
            lastName: req.body.history.lastNameUser,
            email: req.body.history.emailUser
        },
        product: req.body.history.product,
        entry: req.body.history.entry,
        measure: req.body.history.measure,
        price: req.body.history.price,
        promedyPrice: (req.body.history.price / req.body.history.entry).toFixed(2),
        provider: req.body.history.provider,
        date: req.body.history.date
    }

    try {
        const findPromedies = await History.find({
            product: req.body.history.product
        })
        console.log(findPromedies)
        var totalToPromedy = 0
        for (const prices of findPromedies) {
            totalToPromedy = parseFloat(totalToPromedy) + parseFloat(prices.promedyPrice)
        }
        totalToPromedy = parseFloat(totalToPromedy) + parseFloat(historical.promedyPrice)
        console.log(totalToPromedy)
        const promedyToPrice = parseFloat(totalToPromedy) == 0 ? parseFloat(historical.promedyPrice) : (totalToPromedy / (findPromedies.length + 1))
        try{
            const add = await Store.findByIdAndUpdate(req.params.id, {
                $inc: {entry: req.body.entry},
                $push: {purchaseHistory: historical},
                $set: {promedyPrice: parseFloat(promedyToPrice.toFixed(2))}
            })
            if (add) {
                try{
                    console.log("entro")
                    const addHistory = await History.create(historical)
                    console.log(addHistory)
                    if (addHistory) {
                        res.json({status: 'added', data: addHistory, token: req.requestToken })
                    }  
                }catch(err){
                    res.send(err)
                }  
            } 
        }catch(err){
            res.send(err)
        }
    }catch(err) {
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del producto) -- Api end. (Return: Product´s data)

//--------------------------------------------------------------------------------------

//Api que registra un producto en una sucursal (Ingreso: ObjectId de la sucursal, product, measure, price) -- Api that register a product to a branch (Input: branch´s ObjectId, product, measure, price)

stores.post('/registertobranch', protectRoute, async (req,res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)
    const Branch = conn.model('branches', branchSchema)

    try{
        const inspector = await Inventory.find({$and:[{branch:req.body.branch}, {product: req.body.product}]})
        if (inspector.length > 0) {
            res.json({status: 'product already exist'})
        }else{
            const dataProduct = {
                addingHistory:[],
                branch: req.body.branch,
                storeId: req.body.storeId,
                product: req.body.product,
                measure: req.body.measure,
                price: req.body.price,
                quantity: 0,
                entry: 0,
                consume: 0,
                productType: 'Venta',
                alertTotal: 0
            }
            try{
               const register = await Inventory.create(dataProduct)
                if (register) {
                    try{
                        const addCount = await Branch.findByIdAndUpdate(req.body.branch, {
                            $inc:{productsCount:1}
                        })
                        if (addCount) {
                            res.json({status: 'product registered', data: register, token: req.requestToken})
                        }
                    }catch(err){
                        res.send(err)
                    }  
                } 
            }catch(err){
                res.send(err)
            }
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del producto) -- Api end. (Return: Product´s data)

//--------------------------------------------------------------------------------------

//Api que registra cantidades a un producto de una sucursal (Ingreso: ObjectId de la sucursal, product´s ObjectId, user´s ObjectId, nameUser, documentUser, product, entry) -- Api that register quantity to a product by branh (Input: branch´s ObjectId, product´s ObjectId, user´s ObjectId, nameUser, documentUser, product, entry, measure)

stores.post('/addtobranch', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)
    const History = conn.model('historyInventories', historyInventorySchema)
    const Store = conn.model('stores', storeSchema)

    const historical = {
        id: req.body.storeId,
        branch: req.body.branch,
        branchName: req.body.branchName,
        user: {
            id: req.body.idUser,
            firstName: req.body.firstNameUser,
            lastName: req.body.lastNameUser,
            email: req.body.emailUser
        },
        price: 'Abastecimiento',
        provider: 'Bodega',
        product: req.body.product,
        entry: req.body.entry,
        measure: req.body.measure,
        date: new Date()
    }
    console.log(historical)
    try{
        const add = await Inventory.findByIdAndUpdate(req.body.id, {
            $inc: {entry: req.body.entry},
            $push: {addingHistory: historical} 
        })
        if (add) {
            try{
                const storeBalance = await Store.findByIdAndUpdate(req.body.storeId, {
                    $inc:{consume: req.body.entry}
                })
                if (storeBalance) {
                    try{
                        const addHistory = await History.create(historical)
                        if (addHistory) {
                            res.json({status: 'added', token: req.requestToken })
                        }
                    }catch(err){
                        res.send(err)
                    } 
                } 
            }catch(err){
                res.send(err)
            }  
        } 
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del producto) -- Api end. (Return: Product´s data)

//--------------------------------------------------------------------------------------

//Api que realiza un reporte de cierre de la bodega (Ingreso: user´s ObjectId, nameUser, documentUser, products[{ObjectId del producto, count, difference (default : ''), ideal, measure}]) -- Api that make a closed report of the store (Input: user´s ObjectId, nameUser, documentUser, products[{ Product´s ObjectId, count, difference (default : ''), ideal, measure}])

stores.post('/closestore', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryClosed = conn.model('historyClosedInventories', historyClosedInventorySchema)
    const Store = conn.model('stores', storeSchema)

    const products = req.body.products

    for (let i = 0; i < products.length; i++) {
        Store.findByIdAndUpdate(products[i]._id, {
            $set: {
                quantity: parseFloat(products[i].real),
                entry: 0,
                consume: 0
            }
        })
        .then(ready => {})
        products[i].ideal = parseFloat(products[i].quantity + parseFloat(products[i].entry) - parseFloat(products[i].consume))
        var difference = (parseFloat(products[i].real) - parseFloat(products[i].ideal)).toFixed(2)
        if (difference == 0) {
            products[i].difference = "Sin diferencia"
        }
        if (difference > 0) {
            products[i].difference = "+" + difference + " " + products[i].measure
        }
        if (difference < 0) {
            products[i].difference = difference + " " + products[i].measure
        }
    }

    const historical = {
        user: {
            id: req.body.idUser,
            firstName: req.body.firstNameUser,
            lastName: req.body.lastNameUser,
            email: req.body.emailUser
        },
        totalProduct: products.length,
        products: products,
        createdAt: new Date()
    }

    try{
        const history = await HistoryClosed.create(historical)
        if (history) {
            res.json({status: 'closed', data: history, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial) -- Api end. (Return: Historical´s data)

//--------------------------------------------------------------------------------------

//Api que realiza un reporte de cierre del inventario de una sucursal (Ingreso: user´s ObjectId, nameUser, documentUser, products[{ObjectId del producto, count, difference (default : ''), ideal, measure}]) -- Api that make a closed report of the branch´s inventory (Input: user´s ObjectId, nameUser, documentUser, products[{ Product´s ObjectId, count, difference (default : ''), ideal, measure}])

stores.post('/closeinventorybybranch', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const HistoryClosed = conn.model('historyClosedInventories', historyClosedInventorySchema)
    const Inventory = conn.model('inventories', inventorySchema)

    const products = req.body.products

    for (let i = 0; i < products.length; i++) {
        Inventory.findByIdAndUpdate(products[i].id, {
            $set: {
                quantity:products[i].count,
                entry:0,
                consume:0
            }
        })
        .then(ready => {})
        var difference = parseFloat(products[i].count) - parseFloat(products[i].ideal)
        if (difference == 0) {
            products[i].difference = "Sin diferencia"
        }
        if (difference > 0) {
            products[i].difference = "+" + difference + " " + products[i].measure
        }
        if (difference < 0) {
            products[i].difference = difference + " " + products[i].measure
        }
    }

    const historical = {
        user: {
            id: req.body.idUser,
            firstName: req.body.firstNameUser,
            lastName: req.body.lastNameUser,
            email: req.body.emailUser
        },
        branch: req.body.branch,
        totalProduct:products.length,
        products:products,
        createdAt: new Date()
    }

    try{
        const history = await HistoryClosed.create(historical)
        if (history) {
            res.json({status: 'closed', data: history, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del historial) -- Api end. (Return: Historical´s data)

//--------------------------------------------------------------------------------------

//Api que edita la alarma de stock de un producto de la bodega (Ingreso: ObjectId del producto, stock) -- Api that edit stock alarm from the store (Input: Product´s ObjectId, stock)
stores.put('/editstockalarmfromstore/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    Store.findByIdAndUpdate(req.params.id, {
        $set: {alertTotal: req.body.stock}
    })
    .then(done => {
        if (done) {
            res.json({status: 'ok'})     
        }
    }).catch(err => {
        res.send(err)
    })
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

//Api que edita la alarma de stock de un producto del inventario por sucursal (Ingreso: ObjectId del producto, stock) -- Api that edit stock alarm from the inventory by branch (Input: Product´s ObjectId, stock)
stores.put('/editstockalarmfrominventory/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    Inventory.findByIdAndUpdate(req.params.id, {
        $set: {alertTotal: req.body.stock}
    })
    .then(done => {
        if (done) {
            res.json({status: 'ok'})     
        }
    }).catch(err => {
        res.send(err)
    })
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

//Api que registra un producto en la bodega (Ingreso: product, measure, price) -- Api that register a product to the store (Input: product, measure, price)

stores.post('/', protectRoute, async (req,res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    try{
        const inspector = await Store.find({product: req.body.product})
        if (inspector.length > 0) {
            res.json({status: 'product already exist'})
        }else{
            
            const dataProduct = {
                purchaseHistory:[],
                product: req.body.product,
                measure: req.body.measure,
                promedyPrice: 0,
                alertTotal: req.body.alertTotal,
                quantity: 0,
                entry: 0,
                consume: 0
            }
            try{
               const register = await Store.create(dataProduct)
                if (register) {
                    res.json({status: 'product registered', data: register, token: req.requestToken})
                } 
            }catch(err){
                res.send(err)
            }
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del producto) -- Api end. (Return: Product´s data)

//--------------------------------------------------------------------------------------

//Api que registra un provedor (Ingreso: name, document, contact, contactPlus, locations) -- Api that register a provider (Input: name, document, contact, contactPlus, locations)

stores.post('/addprovider', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Provider = conn.model('providers', providerSchema)

    try{
        const inspector = await Provider.find({$or:[{name:req.body.name}, {document: req.body.document}]})
        if (inspector.length > 0) {
            res.json({status: 'name or document already exist'})
        }else{
            const dataProvider = {
                name: req.body.name,
                document: req.body.document,
                contact: req.body.contact,
                contactPlus: req.body.contactPlus,
                location: req.body.location
            }

            const register = await Provider.create(dataProvider)
            if (register) {
                res.json({status: 'provider registered', data: register, token: req.requestToken})
            }
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos del provedor) -- Api end. (Return: Provider´s data)

//--------------------------------------------------------------------------------------

//Api que elimina un producto de la bodega (Input: ObjectId del producto) -- Api that delete a product from the store (Input: Product´s ObjectId)

stores.delete('/deletestoreproduct/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)
    const Inventory = conn.model('inventories', inventorySchema)

    try{
        const deleteProduct = await Store.findByIdAndRemove(req.params.id)
        if (deleteProduct) {
            try{
                const deleteFromBranches = await Inventory.deleteMany({storeId:req.params.id})
                if (deleteFromBranches) {
                    res.json({status: 'product deleted', data: deleteProduct, token: req.requestToken})
                }
            }catch(err){
                res.send(err)
            }
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

//Api que elimina un producto del inventario (Input: ObjectId del producto) -- Api that delete a product from the inventory (Input: Product´s ObjectId)

stores.delete('/deleteinventoryproduct/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)
    const Store = conn.model('stores', storeSchema)
    const Branch = conn.model('branches', branchSchema)

    try {
        const deleteProduct = await Inventory.findByIdAndRemove(req.params.id)
        if (deleteProduct) {
            var total = (deleteProduct.quantity + deleteProduct.entry) - deleteProduct.consume
            const branch = deleteProduct.branch
            try {
                const storeBalance = await Store.findByIdAndUpdate(deleteProduct.storeId, {
                    $inc:{entry: total}
                })
                if (storeBalance) {
                    try{
                        const addCount = await Branch.findByIdAndUpdate(branch, {
                            $inc:{productsCount:-1}
                        })
                        if (addCount) {
                            res.json({status: 'product deleted', token: req.requestToken})
                        }
                    }catch(err){
                        res.send(err)
                    }
                }
            }catch(err){
                res.send(err)
            }  
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

//Api que elimina un provedor (Input: ObjectId del provedor) -- Api that delete a provider (Input: Provider´s ObjectId)

stores.delete('/deleteprovider/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Provider = conn.model('providers', providerSchema)

    try{
        const deleteProduct = await Provider.findByIdAndRemove(req.params.id)
        if (deleteProduct) {
            res.json({status: 'provider deleted', data: deleteProduct, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

//Api que realiza un consumo por venta en el inventario (Ingreso: products[{ObjectId del producto, count}]) -- Api that make a cosume for sale in the inventory (Input: products[{product´s ObjectId, count}])

stores.post('/processsale', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection(`mongodb+srv://puzzles-syswa:${credentialsDatabase}@puzzles-syswa.txga0.mongodb.net/${database}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    const products = req.body.products

    for (let i = 0; i < products.length; i++) {
        Inventory.findByIdAndUpdate(products[i].id, {
            $inc: {consume:products[i].count }
        })
        .then(ready => {})
    }
})

//Final de la api. (Retorna: Nullo) -- Api end. (Return: Null)

//--------------------------------------------------------------------------------------

//Api que crea una alerta de stock (Ingreso: Nullo) -- Api that make an alert of stock (Input: Null)

stores.get('/alertstoreproducts', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Store = conn.model('stores', storeSchema)

    var productsToAlert = []
    Store.find()
    .then(products => {
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            const total = (parseFloat(product.entry) + parseFloat(product.quantity)) - parseFloat(product.consume)
            if (total <= product.alertTotal) {
                productsToAlert.push({total: total, measure: product.measure, nameProduct: product.producto})
            }            
        }
        if (productsToAlert.length > 0) {
            res.json({status: true, productsToAlert: productsToAlert, token: req.requestToken})
        }else{
            res.json({status: false})
        }
    }).catch(err => {
        res.send(err)
    })
})

//Fin de la api (Retorna: Array con productos por alertar) -- Api end (Return: Array with product for alert)

//--------------------------------------------------------------------------------------

//Api que reinserta consumo cuando se anula una venta (Ingreso: products[{ObjectId del producto, consume]}) -- Api that reinsert consume when a sale is nulled (Input: products[{product´s ObjectId, consume}])

stores.post('/nullsale', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)

    var products = req.body.products
    for (let i = 0; i < products.length; i++) {
        Inventory.findByIdAndUpdate(products[i].id, {
            $inc: {consume:-products[i].count}
        })
        .then(ready => {})  
    } 
})

//Final de la api. (Retorna: Nullo) -- Api end. (Return: Null)

//--------------------------------------------------------------------------------------

//Api que cambia el tipo de producto en el inventario (Ingreso: ObjectId del producto, tipo de producto) -- Api that changes product´s type from inventory (Input: product´s ObjectId, product type)

stores.put('/changetype/:id', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Inventory = conn.model('inventories', inventorySchema)
    Inventory.findByIdAndUpdate(req.params.id, {
        $set: {productType:req.body.productType}
    })
    .then(ready => {res.json({status:'ok', token: req.requestToken})})  
 
})

//Final de la api. (Retorna: Respuesta simple) -- Api end. (Return: Simple response)

//--------------------------------------------------------------------------------------

module.exports = stores