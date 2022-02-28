const express = require('express')
const path= require('path')
const http = require('http')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const {generateMessage} = require('./utils/messages')
const {generateLocationMessage} = require('./utils/location')
const { addUser , getUser , removeUser , getUsersInRoom } = require('./utils/users')

const port = process.env.PORT ||3000

const app = express();
const server=http.createServer(app);
const io = socketio(server);

const publicPath= path.join(__dirname,'../public')

app.use(express.static(publicPath))

io.on('connection', (socket)=>{
    console.log('New Websocket connection')

    socket.on('join', ({username,room}, callback) =>{
        
        const {error, user} = addUser({id:socket.id , username , room})

        if(error){
            console.log(error)
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',user.username+' has joined !'))

        io.to(user.room).emit('roomData', {
            room:user.room,
            users:getUsersInRoom(room)
        })

        callback()
    })

    socket.on('message',(msg, callback)=>{

        const user = getUser(socket.id)

        io.to(user.room).emit('message',generateMessage(user.username, msg))
        callback('Delivered to Server')
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',user.username+' has disconnected'))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        } 
    })

    socket.on('sendLocation', (locationObj, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, locationObj.latitude, locationObj.longitude))
        callback('Your Location Shared')
    })
})

server.listen(port , ()=>{
    console.log('Server is up and running on port '+port)
})

