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


const SERVER_MESSAGE = "serverMessage"
const SUPERVISOR_MESSAGE = "supervisorMessage"
const USER_JOIN = "join"
const USER_LEAVE = "disconnect"

const SERVER = "server"
const SUPERVISOR = "supervisor"

io.on('connection', (socket) => {

    socket.on(USER_LEAVE, () => {
        console.log('Client disconnected')
    });

    socket.on(USER_JOIN, userNickname => {

        let message = userNickname +"  has joined the chat "
        console.log(message)

        socket.broadcast.emit(
            SERVER_MESSAGE,
            {message : message, emitter : SERVER});
    });

    socket.on(SUPERVISOR_MESSAGE, msg => {
        console.log('Message from supervisor : ' + msg);
        io.emit(
            SUPERVISOR_MESSAGE,
            {message : msg, emitter : SUPERVISOR});
    });
});

setInterval(() => {
    io.emit('time', new Date().toTimeString())
}, 1000);
