const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:30000');

ws.on('open',() => {
  ws.send('["byTeacher",1150]');
});

ws.on('message',(data)=>{
  console.log(data);
});