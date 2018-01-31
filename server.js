const WebSocket = require('ws');
const r = require('rethinkdb')

const wss = new WebSocket.Server({ port: 30000 });

conn = null;
let connectRethink = () => {
  r.connect({ host: 'localhost', port: 28015 }).then((con) => {
    conn = con;
  })
}

let filterByTeacherChange = (conn, officerCode) => {
  return r.db('mis')
    .table('courses')
    .filter({ officerCode: officerCode })
    .changes()
    .run(conn)
}

let filterByTeacher = (conn, officerCode) => {
  return r.db('mis')
    .table('courses')
    .filter({ officerCode: officerCode })
    .run(conn)
    .then((result) => {
      return result.toArray();
    });
}
let watchTeacher = (ws, conn, officerCode) => {
  filterByTeacherChange(conn, officerCode)
    .then((result) => {
      result.each((err) => {
        filterByTeacher(conn, officerCode).then((result) => {
          ws.send(JSON.stringify(result));
        })
      })
    })
}
connectRethink();
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    chanel = JSON.parse(message);
    if (chanel[0] === 'byTeacher') {
      watchTeacher(ws, conn, chanel[1])
    }
  });


});