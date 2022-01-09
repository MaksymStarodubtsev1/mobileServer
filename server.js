'use strict';

const express = require('express');

const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server)

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

const axios = require('axios')

function post(request) {
  axios.post('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json',request)
    .then((res) => {
  console.log(res.statusCode)
})
}


// function post(request) {
//   axios.post('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json',{
//   body: JSON.stringify(request)
// }).then((res) => {
//   console.log(res.statusCode)
// })
// }

function get() {
  return axios.get('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json')
  .then((response) => response.data)
}

io.on('connection', (socket) => {
  console.log('socket.id',socket.id)
  
socket.emit('secondEvent', 'hello from Server')
socket.on('getChatData', () => {
    async function send(){
      const request = await get()
     return request
    }
    return send()
})
  
  socket.on('firstEvent', (e) => {
    console.log('firstEvent',e)
  })
  
  socket.on('sendMessage', (message) => {
    post(JSON.parse(message))
    console.log('message', message)
    async function send(){
      const request = await get()
      socket.broadcast.emit('updatedMessages', request)
    }
    send()
  })

  socket.on('disconnect', (socket) => {
    console.log('disconnect', socket);
  })
})
