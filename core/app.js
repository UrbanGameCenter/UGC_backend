'use strict';

const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const router = require('./router');


const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.json())
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use('/', router)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const io = socketIO(server);


const SERVER_MESSAGE = "serverMessage"
const SUPERVISOR_MESSAGE = "supervisorMessage"

const CONNECTION = 'connection'
const USER_JOIN = "join"
const USER_JOIN_ROOM = "joinRoom"

const USER_LEAVE = "disconnect"

const SERVER = "server"
const SUPERVISOR = "supervisor"


io.on(CONNECTION, (socket) => {

    socket.on(USER_LEAVE, () => {
        console.log('Client disconnected')
    });

    socket.on(USER_JOIN_ROOM, room => {
        socket.join(room);
        let message = "user est connecté à " + room
        broadcast(socket, message)
    });

    socket.on(USER_JOIN, userName => {
        let message = userName +" est connecté"
        broadcast(socket, message);
    });

    socket.on(SUPERVISOR_MESSAGE, payload => {
        console.log('payload : ' +payload);
        let jsonObject = JSON.parse(payload);
        sendMessageToRoom(socket, jsonObject.message, jsonObject.room);
    });
});

function makeDateString(){
    let dateObj = new Date()
    return dateObj.getHours() +'h'+ dateObj.getMinutes();
}


function broadcast(socket, message) {
    console.log('Broadcast message : ' +message);
    socket.broadcast.emit(
        SERVER_MESSAGE,
        '{"message":"' + message +'","emitter":"' + SERVER +'","date":"'+makeDateString() +'"}');
}

function sendMessageToRoom(socket, message, room) {
    console.log('Message from supervisor : ' + message + ' to room ' + room);
    socket.in(room).emit(
        SUPERVISOR_MESSAGE,
        '{"message":"' + message +'","emitter":"' + SUPERVISOR +'","date":"'+makeDateString() +'"}');
}

setInterval(() => {
    io.emit('time', new Date().toTimeString())
}, 1000);
