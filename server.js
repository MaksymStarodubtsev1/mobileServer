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

function postMessage(request) {
  return axios.post('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json',request)
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

  client.on('subscribe', (roomId) => {
    client.join(roomId)
  })

  client.on('unsubscribe', (roomId) => {
    client.leave(roomId)
  })

  client.on('send', (data) => {
    postMessage(data.message)
      .then(() => {

        // on success message adding -> getting new message data
        get()

           // after success fetching data -> send update to clients in a room
          .then((response) => {
            io.sockets.in(data.room).emit('updatedMessages', response.data)
          })
      })
  })

  /////////

  updateMessages(client)


  client.on('sendMessage', (message) => {
    postMessage(JSON.parse(message))
      .then((response) => {
        socket.emit('updatedMessages', response.data)
      })
  })

  client.on('disconnect', (client) => {
    console.log('disconnect', client);
  })
})
