const express = require('express')
const users = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const userSchema = require('../models/Users')
const credentialSchema = require('../models/userCrendentials')
const configurationSchema = require('../models/configurations')
const key = require('../private/key-jwt');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

users.use(cors())

users.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const User = conn.model('users', userSchema)

    try {
        const getUsers = await User.find({}, {password: 0})
        if(getUsers.length > 0){
            res.json({status: 'ok', data: getUsers, token: req.requestToken})
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){res.send(err)}
})

users.get('/getConfiguration', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Configuration = conn.model('configurations', configurationSchema)

    try {
        const getConfigurations = await Configuration.find()
        if (getConfigurations[0]) {
            res.json({status: 'ok', data: getConfigurations[0], token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

users.get('/getUsersCount', async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const User = conn.model('users', userSchema)

    try {
        const getUsers = await User.find().countDocuments()
        console.log()
        if(getUsers > 0){
            res.json({status: 'ok', token: req.requestToken})
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){res.send(err)}
})

users.post('/registerUser', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const User = conn.model('users', userSchema)

    const data = {
        access: [{
            "ruta" : "usuarios",
            "validaciones" : [
                "editar",
                "registrar",
                "eliminar"
            ]
        },
        {
            "ruta" : "procesar",
            "validaciones" : [
                "editar",
                "nuevo_cliente",
                "nuevo_servicio",
                "descuento"
            ]
        },
        {
            "ruta" : "ventas",
            "validaciones" : [
                "filtrar",
                "anular",
                "detalle"
            ]
        },
        {
            "ruta" : "clientes",
            "validaciones" : [
                "filtrar",
                "registrar",
                "editar",
                "detalle",
                "eliminar"
            ]
        },
        {
            "ruta" : "inventario",
            "validaciones" : [
                "filtrar",
                "registrar",
                "editar",
                "detalle",
                "eliminar"
            ]
        },
        {
            "ruta" : "caja",
            "validaciones" : [
                'cerrar',
                'fondo',
                'visualizar',
                'reporte',
                'editar'
            ]
        },
        {
            "ruta" : "bodega",
            "validaciones" : [
                "filtrar",
                "registrar",
                "editar",
                "detalle",
                "eliminar"
            ]
        }],
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: '',
        status: 'Gerente',
        lastAccess: new Date(),
        createdAt: new Date()
    }

    try {
        const findUser = await User.findOne({email: data.email})
        if (!findUser) {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                data.password = hash
                try {
                    const userCreated = await User.create(data)
                    res.json({status: 'ok', data: userCreated, token: req.requestToken})
                }catch(err){
                    res.send(err)
                }
            })
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

users.post('/registerFirst', async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const User = conn.model('users', userSchema)
    const UserCredential = conn.model('credentials', credentialSchema)
    try {
        const findCredential = await UserCredential.findOne({credential: req.body.credential})
        if (findCredential) {
            const data = {
                access: [{
                    "ruta" : "usuarios",
                    "validaciones" : [
                        "editar",
                        "registrar",
                        "eliminar"
                    ]
                },
                {
                    "ruta" : "procesar",
                    "validaciones" : [
                        "editar",
                        "nuevo_cliente",
                        "nuevo_servicio",
                        "descuento"
                    ]
                },
                {
                    "ruta" : "ventas",
                    "validaciones" : [
                        "filtrar",
                        "anular",
                        "detalle"
                    ]
                },
                {
                    "ruta" : "clientes",
                    "validaciones" : [
                        "filtrar",
                        "registrar",
                        "editar",
                        "detalle",
                        "eliminar"
                    ]
                },
                {
                    "ruta" : "inventario",
                    "validaciones" : [
                        "filtrar",
                        "registrar",
                        "editar",
                        "detalle",
                        "eliminar"
                    ]
                },
                {
                    "ruta" : "caja",
                    "validaciones" : [
                        'cerrar',
                        'fondo',
                        'visualizar',
                        'reporte',
                        'editar'
                    ]
                },
                {
                    "ruta" : "bodega",
                    "validaciones" : [
                        "filtrar",
                        "registrar",
                        "editar",
                        "detalle",
                        "eliminar"
                    ]
                }],
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: '',
                status: 'Gerente',
                lastAccess: new Date(),
                createdAt: new Date()
            }
    
            try {
                const findUser = await User.findOne({email: data.email})
                if (!findUser) {
                    bcrypt.hash(req.body.password, 10, async (err, hash) => {
                        data.password = hash
                        try {
                            const userCreated = await User.create(data)
                            res.json({status: 'ok', data: userCreated, token: req.requestToken})
                        }catch(err){
                            res.send(err)
                        }
                    })
                }
            }catch(err){
                res.send(err)
            }
        }else{
            res.json({status: 'bad', token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//input - formulario con email, password . form with email and password
//output - status, token and access
users.post('/login', (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const User = conn.model('users', userSchema)
	const today = new Date()
	User.findOne({
		email: req.body.email.toLowerCase()
	})
	.then(user => {
		if(user){
			if(bcrypt.compareSync(req.body.password, user.password)){
				User.findByIdAndUpdate(user._id, {
					$set: {
						LastAccess: today
					}
				})
				.then(access => {
					const payload = {
						_id: user._id,
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
						status: user.status,
						access: user.access,
						LastAccess: user.lastAccess
					}
					let token = jwt.sign(payload, key, {
						expiresIn: 60 * 60 * 24
					})
					res.json({token: token, status: user.status, access: user.access})
				})
			}else{
				res.json({error: 'pass incorrecto'})
			}
		}else{
			res.json({error: 'User does not exist'})
		}
	})
	.catch(err => {
		res.send(err)
	})
})

//input - params id . pasar id
// output - status and token
users.delete('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const User = conn.model('users', userSchema)

    try{
        const deleteUser = await User.findByIdAndRemove(req.params.id)
        if (deleteUser) {
            res.json({status: 'ok', token: req.requestToken})
        }else{
            res.json({status: 'users does exist'})
        }
    }catch(err) {
        res.send(err)
    }
})

module.exports = users