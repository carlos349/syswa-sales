const express = require('express')
const clients = express.Router()
const mongoose = require('mongoose')
const credentialsDatabase = require('../private/database-credentials')
const protectRoute = require('../securityToken/verifyToken')
const clientSchema = require('../models/Clients')
const cors = require('cors')

clients.use(cors())

//input - none - nada
//output - status, data and token
clients.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    try {
        const getClients = await Client.find()
        if (getClients.length > 0) {
            res.json({status: 'ok', data: getClients, token: req.requestToken})
        }else{
            res.json({status: 'bad', data: getClients, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }

})

//input - params id, pasar id
//output - status, data and token
clients.get('/findOne/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    try {
        const getClient = await Client.findOne({_id: req.params.id})
        if (getClient) {
            res.json({status: 'ok', data: getClient, token: req.requestToken})
        }else{
            res.json({status: 'user does exist', data: getClient, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//input - none - nada
//output - status
clients.get('/countClients', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    try {
        const getClients = await Client.find().count()
        if (getClients.length > 0) {
            res.json({status: 'ok', data: getClients, token: req.requestToken})
        }else{
            res.json({status: 'bad', data: getClients, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }

})

//input - pasar id . pasar id
//output - status
clients.get('/sendMailChange/:id', (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    Client.findById(req.params.id)
    .then(client => {
        const mail = {
            from: "kkprettynails.cl",
            to: client.email,
            subject: 'Cambio de información',
            html: `
            <div style="width: 100%; padding:0;text-align:center;">
                <div style="width: 60%;height: 8vh;margin: auto;background-color: #fdd3d7;box-shadow: 0 2px 5px 0 rgba(0,0,0,.14);padding: 20px;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:#172b4d;text-align:justify;-webkit-box-shadow: 0px 6px 8px -8px rgba(0,0,0,0.73);-moz-box-shadow: 0px 6px 8px -8px rgba(0,0,0,0.73);box-shadow: 0px 6px 8px -8px rgba(0,0,0,0.73);">
                    <div style="width: 100px;margin:auto;border-radius:55%;background-color:#f8f9fa;padding: 10px;">     
                        <img style="width: 100%;margin-bot:20px;" src="https://kkprettynails.cl/img/logokk.png" alt="Logo kkprettynails">
                    </div>
                </div>
                <div style="width: 100%;margin: auto;padding-top: 5%;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:#172b4d;padding-bottom: 40px;">
                    <center>
                        <div style="width:60%;text-align: center;">
                            
                            <p style="text-align:center;margin-top:10px;font-size:24px;"> <strong>Estimado(a) ${client.firstName} ${client.lastName}.</p>
                            <p style="text-align:left;font-size:13px;font-weight: 300;width: 100%;margin:auto;border-top: 3px solid #fdd3d7 !important;padding-top: 20px;"><strong> Actualización de datos</strong> <br><br>
                                Queremos confirmar y verificar que los cambios que has ejecutado fueron realizados correctamente.
                                <br><br>
                                Nombre: ${client.firstName} ${client.lastName} <br>
                                E-mail: ${client.email}  <br>
                                Teléfono: ${client.phone} <br><br>
                                Cualquier consulta, no dudes en escribirnos, estaremos encantadas de atenderte.
                            </p>

                        
                        <div>
                    </center>
                </div>
                <div style="width: 100%;background-color: #f0f1f3;box-shadow: 0 2px 5px 0 rgba(0,0,0,.14);margin: auto;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:#181d81;padding-bottom:8px;-webkit-box-shadow: 0px -4px 11px 0px rgba(0,0,0,0.12);-moz-box-shadow: 0px -4px 11px 0px rgba(0,0,0,0.12);box-shadow: 0px -4px 11px 0px rgba(0,0,0,0.12);">
                        <center>
                        <div style="width:100%;">
                            <center>
                            <p style="text-align:center;font-size:16px;"><strong> Contáctanos</strong></p>
                            <a  href="mailto:kkprettynails@gmail.com" style="margin-left:20px;text-decoration:none;"> 
                                <img style="width:4%;" src="https://kkprettynails.cl/img/mail.png" alt="Logo mail">
                            </a>
                            <a  href="https://www.instagram.com/kkprettynails/" style="margin-left:20px;text-decoration:none;">
                                <img style="width:4%;" src="https://kkprettynails.cl/img/ig.png" alt="Logo ig">
                            </a>
                            <a  href="https://api.whatsapp.com/send?phone=56972628949&text=&source=&data=&app_absent=" style="margin-left:20px;text-decoration:none;">
                                <img style="width:4%;" src="https://kkprettynails.cl/img/ws.png" alt="Logo ws">
                            </a>
                            <a  href="https://kkprettynails.cl" style="margin-left:20px;text-decoration:none;">
                                <img style="width:4%;" src="https://kkprettynails.cl/img/web.png" alt="Logo web">
                            </a>
                            <a  href="https://goo.gl/maps/m5rVWDEiPj7q1Hxh9" style="margin-left:20px;text-decoration:none;">
                                <img style="width:4%;" src="https://kkprettynails.cl/img/market.png" alt="Logo web">
                            </a>
                            </center>
                        </div>
                        </center>
                    </div>
            </div>
            `
        }
        Mails.sendMail(mail)
        .then(send => {
            console.log(send)
        }).catch(err => {
            console.log(err)
        })
        res.json({status: 'ok'})
    }).catch(err => {
        res.send(err)
    })
})

//input - form with firstName, lastName, email, phone, instagram, birthday, recomendador . formulario con firstName, lastName, email, phone, instagram, birthday, recomendador
//output - status and token
clients.post('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    const clientData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        instagram: req.body.instagram,
        lastAttend: new Date(),
        createdAt: new Date(),
    }

    try {
        const findClient = await Client.findOne({email: clientData.email})
        if (!findClient) {
            try{
                const createClient = await Client.create(clientData)
                res.json({status: 'client create', data: createClient, token: req.requestToken})
            }catch(err){
                res.send(err)
            }
        }else{
            res.json({status: 'client exist', token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//input - params id . pasar id
//output - status and token
clients.delete('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    try {   
        const deleteClient = await Client.findByIdAndDelete(req.params.id)
        res.json({status: 'ok', token: req.requestToken})
    }catch(err){
        res.send(err)
    }
})

//input - params id, form with firstName, lastName, email, phone, instagram . pasar id, formulario con  firstName, lastName, email, phone, instagram
//output - status and token
clients.put('/:id', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Client = conn.model('clients', clientSchema)

    try {
        const findClient = await Client.findOne({
            email: req.body.email
        })
        if (!findClient) {
            try {
                
                const updateClient = await Client.findByIdAndUpdate(req.params.id, {
                    $set: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        instagram: req.body.instagram
                    }
                })
                if (updateClient) {
                    res.json({status: 'update client', token: req.requestToken})
                }
            }catch(err) {
                res.send(err)
            }
        }else{
            if (findClient._id == req.params.id) {
                try {
                    const updateClient = await Client.findByIdAndUpdate(req.params.id, {
                        $set: {
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email:req.body.email,
                            phone: req.body.phone,
                            instagram: req.body.instagram
                        }
                    })
                    if (updateClient) {
                        res.json({status: 'update client', token: req.requestToken})
                    }
                } catch(err) {
                    res.send(err)
                }
            }else{
                res.json({status: 'client does exist'})
            }
        }
    }catch(err){
        res.send(err)
    }
})

module.exports = clients