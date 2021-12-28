// const io = require('socket.io')(808);

const express = require('express');
const app = express();
const http = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const axios = require('axios')


function post(request) {
  axios.post('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json',{
  body: JSON.stringify(request)
}).then((res) => {
  console.log(res.statusCode)
})
}


function get() {
  return axios.get('https://vue-http-demo-763e4-default-rtdb.europe-west1.firebasedatabase.app/olenamaksym.json')
  .then((response) => console.log(response.data))
}

io.on('connection', (socket) => {
  console.log('socket.id',socket.id)


  socket.on('firstEvent', (e) => {
    console.log('firstEvent',e)
  })
  socket.emit('secondEvent', 'hello from Server')

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

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

