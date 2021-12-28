// const io = require('socket.io')(808);

const express = require('express');
const app = express();
const http = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req, res) => {
  res.send('Hello, I"m working!');
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

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

