const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const port = require('./private/port.js')
// const database = require('./private/database.js')
// const verify = require('./accessFunctions/verify.js')

// settings
app.set('port', process.env.PORT || 3200)
app.set('trust proxy', true);

//middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
// verify()

//Websockets
io.on('connection', socket  => {
  socket.on('sendNotification', data => {
	  io.emit('notify', data);
  })
});

//Routes

app.use('/users', require('./routes/Users.js'))
app.use('/sales', require('./routes/Sales.js'))
app.use('/products', require('./routes/Products.js'))
// app.use('/ventas', require('./routes/Venta.js'))
// app.use('/manicuristas', require('./routes/Manicuristas.js'))
// app.use('/services', require('./routes/Services.js'))
app.use('/configurations', require('./routes/Configurations.js'))
// app.use('/metrics', require('./routes/Metrics.js'))
app.use('/dates', require('./routes/Dates.js'))
// app.use('/expenses', require('./routes/Expenses.js'))
// app.use('/mails', require('./routes/Mails.js'))
app.use('/clients', require('./routes/Clients.js'))
app.use('/branches', require('./routes/Branch.js'))
app.use('/stores', require('./routes/Store.js'))
// app.use('/pedidos', require('./routes/Pedidos.js'))
app.use('/notifications', require('./routes/Notifications.js'))


//Static files

app.use('/static', express.static(__dirname + '/public'));

// server in listened
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app);

server.listen(app.get('port'), () => {
	console.log('Server on port: ', app.get('port'))
});