'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
const router = require('./router');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../web/index.html');

const server = express()
    .use(express.json())
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use('/', router)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    });

    socket.on('join', userNickname => {

        console.log(userNickname +" : has joined the chat "  )
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ")

    });

    socket.on('supervisorMessage', msg => {
        console.log('Message from supervisor : ' + msg);
        io.emit('supervisorMessage', msg);
    });
});

setInterval(() => {
    io.emit('time', new Date().toTimeString())
}, 1000);
