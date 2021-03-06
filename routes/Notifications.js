const express = require('express')
const notifications = express.Router()
const mongoose = require('mongoose')
const protectRoute = require('../securityToken/verifyToken')
const notificationSchema = require('../models/Notifications')
const cors = require('cors')

notifications.use(cors())

//Final de la api. (Retorna: Notificaciones) -- Api end. (Return: Notifications)

//-------------------------------------------------------------------------

//Api que busca todas las notificaciones que no ha visto un usuario (Ingreso: ObjectId del usuario) -- Api that search all the unview notifications for a user (Input: User´s ObjectId)

notifications.get('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Notification = conn.model('notifications', notificationSchema)
    
    try{
        const getnotifications = await Notification.find().sort({createdAt: -1}).limit(150)
        if (getnotifications.length > 0 ) {
            let onlyYours = []
            for (let i = 0; i < getNotifications.length; i++) {
                const elementN = getNotifications[i];
                let inps = true
                for (let e = 0; e < getNotifications[i].views.length; e++) {
                    const element = getNotifications[i].views[e];
                    if (element == req.params.id) {
                        inps = false
                        break
                    }
                }
                if (inps) {
                    onlyYours.push(elementN)
                }
            }
            res.json({status: 'ok', data: onlyYours, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Notificaciones) -- Api end. (Return: Notifications)

//-------------------------------------------------------------------------

//Api que registra que un usuario vio sus notificaciones (Ingreso: ObjectId del usuario) -- Api that register that an user view its notifications (Input: User´s ObjectId)

notifications.get('/validateviews/:id', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Notification = conn.model('notifications', notificationSchema)

    Notification.find().sort({createdAt: -1}).limit(150)
    .then(getNotifications => {
        if (getNotifications) {    
            let onlyYours = []
            for (let i = 0; i < getNotifications.length; i++) {
                const elementN = getNotifications[i];
                let inps = true
                for (let e = 0; e < getNotifications[i].views.length; e++) {
                    const element = getNotifications[i].views[e];
                    if (element == req.params.id) {
                        inps = false
                    }
                }
                if (inps) {
                    onlyYours.push(elementN)
                    Notification.findByIdAndUpdate(elementN._id, {$push: { views: req.params.id}})
                    .then(ready => {})
                }
            }
            res.json({status: 'ok', data: onlyYours, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }).catch(err=>{
        res.send(err)
    })
})

notifications.get('/noViews/:id', protectRoute, (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Notification = conn.model('notifications', notificationSchema)

    Notification.find().sort({date: -1}).limit(150)
    .then(getNotifications=>{
        if (getNotifications) {    
            let onlyYours = []
            for (let i = 0; i < getNotifications.length; i++) {
                const elementN = getNotifications[i];
                let inps = true
                for (let e = 0; e < getNotifications[i].views.length; e++) {
                    const element = getNotifications[i].views[e];
                    if (element == req.params.id) {
                        inps = false
                        break
                    }
                }
                if (inps) {
                    onlyYours.push(elementN)
                }
            }
            res.json({status: 'ok', data: onlyYours})
        }
    })
    .catch(err=>{
        res.send(err)
    })
    
}) 

//Final de la api. (Retorna: Notificaciones) -- Api end. (Return: Notifications)

//-------------------------------------------------------------------------

//Api que busca todas las notificaciones (max: 500) (Ingreso: Nullo) -- Api that search all the notifications (max: 500) (Input: Null)

notifications.get('/getall', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Notification = conn.model('notifications', notificationSchema)

    try{
        const getnotifications = await Notification.find().sort({date: -1}).limit(500)
        if (getnotifications.length > 0 ) {
            res.json({status: 'ok', data: getnotifications, token: req.requestToken})
        }else{
            res.json({status: 'nothing found'})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Notificaciones) -- Api end. (Return: Notifications)

//-------------------------------------------------------------------------

//Api que crea una nueva notificación (Ingreso: branch, userName, userImg, detail, link) -- Api that create a new notification (Input: branch, userName, userImg, detail, link)

notifications.post('/', protectRoute, async (req, res) => {
    const database = req.headers['x-database-connect'];
    const conn = mongoose.createConnection('mongodb://localhost/'+database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const Notification = conn.model('notifications', notificationSchema)

    const dataNotify = {
        userName: req.body.userName,
        userImg: req.body.userImg,
        detail: req.body.detail,
        link: req.body.link,
        createdAt: new Date()
    }

    try{
        const register = await Notification.create(dataNotify)
        if (register) {
            res.json({status: 'ok', data: register, token: req.requestToken})
        }
    }catch(err){
        res.send(err)
    }
})

//Final de la api. (Retorna: Datos de la notificacion) -- Api end. (Return: Notification´s data)

module.exports = notifications