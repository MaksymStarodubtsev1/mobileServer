'use strict';

const express = require('express');

const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server)

const axios = require('axios')

function post(request) {
  axios.post('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json',request)
    .then((res) => {
  console.log(res.statusCode)
})
}

function get() {
  return axios.get('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json')
}

function updateMessages(socket) {
  get()
    .then((response) => {
      socket.emit('updatedMessages', response.data)
    })
}



io.on('connection', (client) => {
  console.log('client.id',client.id)
  //
  // client.on('subscribe', (roomId) => {
  //   client.join(roomId)
  // })
  //
  // client.on('unsubscribe', (roomId) => {
  //   client.leave(roomId)
  // })
  //
  // client.on('send', (data) => {
  //   io.sockets.in(data.room).emit('message', data)
  // })

  /////////

  updateMessages(client)


  client.on('sendMessage', (message) => {
    post(JSON.parse(message))
    console.log('message', message)

    updateMessages(io)
  })

  client.on('disconnect', (client) => {
    console.log('disconnect', client);
  })
})
