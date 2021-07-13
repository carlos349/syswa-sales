const express = require('express')
const sales = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const saleSchema = require('../models/Sales')
const closureSchema = require('../models/Closures')
const cashfundSchema = require('../models/CashFunds')
const daySaleSchema = require('../models/DaySales')
const configurationSchema = require('../models/configurations')
const clientSchema = require('../models/Clients')
const productSchema = require('../models/Products')
const inventorySchema = require('../models/Inventory')
const formats = require('../formats')
const cors = require('cors')

sales.use(cors())

// input - null
// output - status, data, token
sales.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Sale = conn.model('sales', saleSchema)
    try {
        const getSales = await Sale.find()
        if (getSales.length > 0) {
            res.json({status: 'ok', data: getSales, token: req.requestToken})
        }else{
            res.json({status: 'bad', data: getSales, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

// input - null
// output - status, data, token
sales.get('/getConfiguration', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Configuration = conn.model('configuration', configurationSchema)

    try {
        const getConfiguration = await Configuration.find()
        console.log(getConfiguration)
        if (getConfiguration.length > 0) {
            res.json({status: 'ok', data: getConfiguration, token: req.requestToken})
        }else{
            res.json({status: 'bad', data: getConfiguration, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

// input - null
// output - status, data, token
sales.get('/createConfiguration', async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })

  const Configuration = conn.model('configurations', configurationSchema)
  const data = {
    businessName: "Puzzles Cafe",
    businessPhone: {
      phone: '979363236',
      international: '+56 9 7936 3236'
    },
    businessType: 'Panaderia y Reposteria',
    businessLocation: 'Merced 80, RM',
    typesPay: [
      'Efectivo',
      'Debito',
      'Credito',
      'Transferencia'
    ],
    currency: 'CLP'
  }
  
  try {
      const getConfiguration = await Configuration.create(data)
      res.json({status: 'ok'})
  }catch(err){
      res.send(err)
  }
})

// input - params id, pasar id
//  output - status, data and token
sales.get('/getClosing/:id', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  const Closure = conn.model('closures', closureSchema)

  try{ 
      const findSale = await Closure.findById(req.params.id)
      console.log(findSale)
      if (findSale) {
          res.json({status: 'ok', data: findSale, token: req.requestToken})
      }else{
          res.json({status: 'sale does exist', token: req.requestToken})
      }
  }catch(err){
      res.send(err)
  }
})

//input - null
//output - status, data and token
sales.get('/Closing', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const Closure = conn.model('closures', closureSchema)

    try {
        const findClosures = await Closure.find().sort({createdAt: -1})
        if (findClosures.length > 0) {
            res.json({status: 'ok', data: findClosures, token: req.requestToken})
        }else{
            res.json({status: 'closures does exist'})
        }
    }catch(err){
        res.send(err)
    }
})

//input - branch
//output - status, data and token
sales.get('/totalSales', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = await mongoose.createConnection(`mongodb+srv://puzzles-syswa:${credentialsDatabase}@puzzles-syswa.txga0.mongodb.net/${database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const Sale = conn.model('sales', saleSchema)
  const dateDaily = new Date()
  const sinceActual = dateDaily.getFullYear() +"-"+(dateDaily.getMonth() + 1)+"-1 00:00"
  const untilActual = dateDaily.getFullYear() +"-"+(dateDaily.getMonth() + 1)+"-31 24:00"

  try {
    const salesThisMonth = await Sale.find({
      $and: [
          {createdAt: { $gte: sinceActual, $lte: untilActual }},
          {status:true}
      ]
    })
    var totalSales = 0
    for (const sale of salesThisMonth) {
      totalSales = totalSales + sale.totals.total
    }
    res.json({status: 'ok', data: totalSales, token: req.requestToken})
  }catch(err){res.send(err)}
})

//input - form with branch
//output - status, data and token
sales.get('/getClosingDay', protectRoute, async(req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const DaySale = conn.model('daySales', daySaleSchema)
    const Configuration = conn.model('configurations', configurationSchema)

    try {
        const getConfiguration = await Configuration.find()
        if (getConfiguration.length > 0) {
            const data = getConfiguration[0].typesPay
            var totalTypePay = []
            var TypesPay = []
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                totalTypePay.push({
                    type: element,
                    total: 0
                })
                TypesPay.push({
                  type: element,
                  total: 0
              })
            }
            try {
                const getDaySales = await DaySale.find()
                if (getDaySales.length > 0) {
                    for (let i = 0; i < totalTypePay.length; i++) {
                        const element = totalTypePay[i];
                        for (let index = 0; index < getDaySales.length; index++) {
                            const elementTwo = getDaySales[index];
                            for (let e = 0; e < elementTwo.typesPay.length; e++) {
                                const elementThree = elementTwo.typesPay[e];
                                if (element.type == elementThree.type) {
                                  element.total = element.total + elementThree.total
                                }
                            }
                        }
                    }
                    var total = 0
                    totalTypePay.forEach(element => {
                        total = total + element.total
                    });
                    totalTypePay.push({
                        type: 'Total',
                        total: total
                    })
                    res.json({status: 'ok', data: {totals: totalTypePay, types: TypesPay}, token: req.requestToken})
                }else{
                    res.json({status: 'bad'})
                }
            }catch(err){
                res.send(err)
            }
        }else{
            res.json({status: 'configuration does exist'})
        }
    }catch(err){
        res.send(err)
    }
})

// input - params id, pasar id
//  output - status, data and token
sales.get('/getSale/:id', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  const Sale = conn.model('sales', saleSchema)
  
  try{ 
      const findSale = await Sale.findById(req.params.id)
      console.log(findSale)
      if (findSale) {
          res.json({status: 'ok', data: findSale, token: req.requestToken})
      }else{
          res.json({status: 'sale does exist', token: req.requestToken})
      }
  }catch(err){
      res.send(err)
  }
})

// input - null
//output - status, data and token
sales.get('/dataChecker', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const Sale = conn.model('sales', saleSchema)

    const dateDaily = new Date()
    const dateDailyToday = dateDaily.getFullYear() +"-"+(dateDaily.getMonth() + 1)+"-"+dateDaily.getDate()
    dateDaily.setDate(dateDaily.getDate() + 1)
    const dailyTomorrow = dateDaily.getFullYear() +"-"+(dateDaily.getMonth() + 1)+"-"+dateDaily.getDate()

    try{
        const getSales = await Sale.find({
            $and: [
                {createdAt: { $gte: dateDailyToday, $lte: dailyTomorrow }},
                {status: true}
            ]
        })
        if (getSales.length > 0) {
            res.json({status: 'ok', data: getSales, token: req.requestToken})
        }else{
            res.json({status: 'not found sales'})
        }
    }catch(err){
        res.send(err)
    }
})

sales.post('/findSalesByDate', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  const Sale = conn.model('sales', saleSchema)

  try {
      const Sales = await Sale.find({
        createdAt: { 
          $gte: req.body.dates[0]+' 00:00', 
          $lte: req.body.dates[1]+' 24:00' 
        }
      })
      if (Sales.length == 0) {
          res.json({status: 'sales does exist'})
      }else{
          res.json({status: 'ok', data: Sales, token: req.requestToken})
      }
  }catch(err) {
      res.send(err)
  }
})

//input - params id . pasar id
//output - status, data and token
sales.post('/findSalesByDay', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  const Sale = conn.model('sales', saleSchema)

  const dates = req.body.dates
  const splitDates = dates.split(':')
  const since = splitDates[0]
  const until = splitDates[1] 
  try {
    const Sales = await Sale.find({
        $and: [
            {createdAt: { $gte: since, $lte: until }},
            {branch: req.body.branch}
        ]
    })
    if (Sales.length == 0) {
        res.json({status: 'sales does exist'})
    }else{
        res.json({status: 'ok', data: Sales, token: req.requestToken})
    }
  } catch(err) {
      res.send(err)
  }
})

// input - form with rangeExcel, lenderSelect, clientSelect
// output - status, dataTable and token
sales.post('/generateDataExcel', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const Sale = conn.model('sales', saleSchema)

    const data = {
      rangeExcel: req.body.rangeExcel,  
      clientSelect: req.body.clientSelect
    }
    console.log(data)
    var dataTable = []
    if (data.clientSelect.length == 0) {
        try {
            const sales = await Sale.find({
                $and: [
                  {createdAt: {$gte: data.rangeExcel[0]+' 00:00', $lte: data.rangeExcel[1]+' 24:00'}},
                  {status:true}
                ]
            })
            if(sales.length > 0){
              for (let index = 0; index < sales.length; index++) {
                const element = sales[index];

                var typesPay = ''
                for (let e = 0; e < element.typesPay.length; e++) {
                    const elementTwo = element.typesPay[e];
                    if (elementTwo.total > 0) {
                      typesPay = typesPay + elementTwo.type + ': ' + elementTwo.total + ' '
                    }
                }
                for (const items of element.items) {
                  if (items.type == 'product') {
                    dataTable.push({Fecha: formats.dates(element.createdAt), ID: 'V-'+element.count, Cliente: element.client.firstName+' '+element.client.lastName, Producto: items.item.name, Cantidad: items.quantityProduct, Precio: items.item.price, 'Tipo de pago': typesPay, Total: items.totalItem})
                  }
                }
              }
              res.json({status: 'ok', dataTable: dataTable, token: req.requestToken})
            }else{
              res.json({status: 'bad'})
            }
        }catch(err){
            res.send(err)
        }
    }else{
      try {
        const sales = await Sale.find({
            $and: [
                {createdAt: {$gte: data.rangeExcel[0]+' 00:00', $lte: data.rangeExcel[1]+' 24:00'}},
                {'client.email': data.clientSelect },
                {status:true},
                {branch: req.body.branch}
            ]
        })
        if(sales.length > 0){
          for (let index = 0; index < sales.length; index++) {
            const element = sales[index];

            var typesPay = ''
            for (let e = 0; e < element.typesPay.length; e++) {
                const elementTwo = element.typesPay[e];
                if (elementTwo.total > 0) {
                  typesPay = typesPay + elementTwo.type + ': ' + elementTwo.total + ' '
                }
            }
            for (const items of element.items) {
              var additionals = ''
              var totalAddi = 0
              for (const addi of items.additionals) {
                additionals = additionals == '' ? addi.name : + ', ' + addi.name
                totalAddi = totalAddi + addi.price
              }
              if (items.type == 'service') {
                dataTable.push({Fecha: formats.dates(element.createdAt), ID: 'V-'+element.count, Cliente: element.client.firstName+' '+element.client.lastName, Producto: '', Servicio: items.item.name, Precio: items.item.price, Adicionales: additionals == '' ? 'Sin adicional' : additionals, 'Total Adicionales': totalAddi,  'Tipo de pago': typesPay, Total: items.totalItem})
              }else{
                dataTable.push({Fecha: formats.dates(element.createdAt), ID: 'V-'+element.count, Cliente: element.client.firstName+' '+element.client.lastName, Producto: items.item.name+', Cantidad: '+items.quantityProduct, Servicio: '', Precio: items.item.price, Adicionales: 'Sin adicional', 'Total Adicionales': 'Sin adicional',  'Tipo de pago': typesPay, Total: items.totalItem})
              }
              
            }
          }
          console.log(dataTable)
          res.json({status: 'ok', dataTable: dataTable, token: req.requestToken})
        }else{
          res.json({status: 'bad'})
        }
      }catch(err){
          res.send(err)
      }
    }
})

sales.get('/getFund', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const CashFund = conn.model('cashfunds', cashfundSchema)

    try {
      const getFund = await CashFund.find()
      if (getFund.length > 0) {
        res.json({status: 'ok', data: getFund[0], token: req.requestToken})
      }else{
        res.json({status: 'bad', token: req.requestToken})
      }
    }catch(err){
      res.send(err)
    }
})

// input - form with total, branch, services, employe, client, payType, typesPay, purchaseOrder, discount, design, ifProcess, date
// ouput - status and token
sales.post('/process', protectRoute, (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })

  const CashFund = conn.model('cashfunds', cashfundSchema)
  const DaySale = conn.model('daySales', daySaleSchema)
  const Sale = conn.model('sales', saleSchema)
  const Client = conn.model('clients', clientSchema)
  const Product = conn.model('products', productSchema)

  const items = req.body.items
  const total = req.body.total
  const totalPay = req.body.totalPay
  const typesPay = req.body.typesPay
  const client = req.body.client
  const clientId = req.body.clientId
  const restPay = req.body.restPay
  
  const dataSale = {
    items: [],
    client: client,
    localGain: 0,
    typesPay: typesPay,
    purchaseOrder: 0,
    count: 0,
    status: true,
    totals: {
      total: total,
      totalPay: totalPay
    },
    uuid: new Date().getTime(),
    createdAt: req.body.date
  }

  const daySale = {
    items: items,
    typesPay: typesPay,
    total: total,
    idTableSales: '',
    createdAt: req.body.date
  }
  
  for (const item of items) {
    dataSale.localGain = dataSale.localGain + item.totalLocal
    dataSale.items.push({
      item: item.item,
      price: item.price,
      discount: item.discount,
      quantityProduct: item.quantityProduct,
      totalItem: item.total,
      type: item.tag
    })
  }
  
  CashFund.findOne()
  .then(cashFund => {
    if (cashFund) {
      if (cashFund.validator) {
        if (restPay > 0) {
          CashFund.findByIdAndUpdate(cashFund._id, {
            $inc: {
              amount: parseFloat('-'+restPay),
              amountEgress: parseFloat(restPay)
            }
          }).then(readyCash => {})
        }
        Sale.find().sort({count: -1}).limit(1)
        .then(findSale => {
          dataSale.count = findSale[0] ? findSale[0].count + 1 : 1
          Sale.create(dataSale)
          .then(createSale => {
            daySale.idTableSales = createSale._id
            Client.findByIdAndUpdate(clientId, {
              $inc: {attends: 1},
              $set: {lastAttend: req.body.date},
              $push: {historical: dataSale}
            })
            .then(editClient => {
              DaySale.create(daySale)
              .then(createDaySale => {
                for (let index = 0; index < items.length; index++) {
                  const item = items[index];
                  if (item.tag == 'product') {
                    Product.findByIdAndUpdate(item.item._id,{
                      $inc: {
                        consume: parseInt(item.quantityProduct)
                      }
                    }).then(editInventory => {})
                  }
                }
                res.json({status: 'ok', token: req.requestToken})
              }).catch(err => res.send(err))
            }).catch(err => res.send(err))
          }).catch(err => res.send(err))
        }).catch(err => res.send(err))
      }else{
        res.json({status: 'no-cash'})
      }
    }else{
      res.json({status: 'no-cash'})
    }
  })
})

// input - params id, form with branch, manual and system
// ouput - status and token 
sales.post('/closeDay/:name', protectRoute, async (req, res) => {
  const database = req.headers['x-database-connect'];
  const conn = mongoose.createConnection('mongodb://localhost/'+database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  const CashFund = conn.model('cashfunds', cashfundSchema)
  const DaySale = conn.model('daySales', daySaleSchema)
  const Closure = conn.model('closures', closureSchema)
  
  const manual = []
  const system = []

  manual.push({
    type: 'Fondo de caja',
    total: req.body.entryFund
  })
  manual.push({
    type: 'Efectivo',
    total: req.body.cash
  })
  manual.push({
    type: 'Egreso de caja',
    total: req.body.egressManual
  })
  manual.push({
    type: 'Total efectivo',
    total: req.body.entryFund + req.body.cash - req.body.egressManual
  })
  system.push({
    type: 'Fondo de caja',
    total: req.body.entryFund
  })
  system.push({
    type: 'Efectivo',
    total: req.body.system[0].total
  })
  system.push({
    type: 'Egreso de caja',
    total: req.body.egressManual
  })
  system.push({
    type: 'Total efectivo',
    total: req.body.entryFund + req.body.system[0].total - req.body.egressManual
  })
  for(typesManual of req.body.manual){
    if (typesManual.type != 'Efectivo') {
      manual.push({
        type: typesManual.type,
        total: typesManual.total
      })
    }
  }
  for(typesSystem of req.body.system){
    if (typesSystem.type != 'Efectivo') {
      system.push({
        type: typesSystem.type,
        total: typesSystem.total
      })
    }
  }
  const CloseDay = {
      manual: manual,
      system: system,
      closerName: req.params.name,
      createdAt: new Date()
  }

  try {
      const closed = await Closure.create(CloseDay)
      if (closed) {
          try {
              const removeSales = await DaySale.deleteMany({})
              if (removeSales) {
                  try {
                      const findCashFund = await CashFund.find()
                      try {
                          const reloadFunds = await CashFund.findByIdAndUpdate(findCashFund[0]._id, {
                              $set: {
                                  userRegister: '',
                                  amount: 0, 
                                  amountEgress: 0,
                                  validator: false
                              }
                          })
                          if (reloadFunds) {
                              res.json({status: 'ok', token: req.requestToken})
                          }
                          res.json({status: 'bad'})
                      }catch(err){
                          res.send(err)
                      }
                  }catch(err){
                    res.send(err)
                  }
              }
              res.json({status: 'bad'})
          }catch(err){
              res.send(err)
          }
      }
      res.json({status: 'bad'})
  }catch(err){
      res.send(err)
  }
})

// input - form with total, branch, userRegister, amount
// ouput - status and token
sales.post('/registerFund', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const CashFund = conn.model('cashfunds', cashfundSchema)

    try {
      const find = await CashFund.find()
      if (find.length > 0) {
        try {
          const register = await CashFund.findByIdAndUpdate(find[0]._id, {
            $set: {
              userRegister: req.body.userRegister,
              amount: req.body.amount,
              amountEgress: 0,
              validator: true
            }
          })
          if (register) {
            res.status(200).json({status: 'ok', token: req.requestToken})
          }else{
            res.json({status: 'bad'})
          }
        }catch(err){res.send(err)}
      }else{
        try {
          const createData = await CashFund.create({
            userRegister: req.body.userRegister,
            amount: req.body.amount,
            amountEgress: 0,
            quantity: 0,
            validator: true
          })
          if (createData) {
            res.json({status: 'ok'})
          }
        }catch(err){res.send(err)}
      }
    }catch(err){res.send(err)}
})

// input - params id, form with employeComision
// ouput - status and token
sales.put('/:id', protectRoute, async (req, res, next) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const DaySale = conn.model('daySales', daySaleSchema)
    const Sale = conn.model('sales', saleSchema)
    const Inventory = conn.model('inventories', inventorySchema)
    const id = req.params.id
    
    try {
      const cancelSale = await Sale.findByIdAndUpdate(id, {
        $set: { status: false}
      })
      if (cancelSale) {
        console.log(cancelSale)
        const items = cancelSale.items
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (item.type == 'product') {
            Inventory.findByIdAndUpdate(item.item._id,{
              $inc: {
                consume: parseFloat('-'+item.quantityProduct)
              }
            }).then(editInventory => {})
          }else{
            for (const product of item.item.products) {
              Inventory.findByIdAndUpdate(product.id,{
                $inc: {
                  consume: parseFloat('-'+product.count)
                }
              }).then(editInventory => {})
            }
          }
        }
        try {
          const removeSale = await DaySale.findOneAndRemove({idTableSales: id})
          res.json({status: 'ok', token: req.requestToken})
        }catch(err){res.send(err)}
      }
      res.json({status: 'bad'})
    }catch(err){res.send(err)}
})

// input - params id, form with manual
// ouput - status and token
sales.put('/editclosedmanualamounts/:id', protectRoute, async (req,res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const Closure = conn.model('closures', closureSchema)

    const data = req.body.manual
    try {
        const editClosure = await Closure.findByIdAndUpdate(req.params.id, {
            $set:{
                manual: data
            }
        })
        res.json({status: 'ok', token: req.requestToken})
    }catch(err){
        res.send(err)
    }
})

module.exports = sales