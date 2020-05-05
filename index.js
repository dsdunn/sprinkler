const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const db = require('./queries');
const { Clock } = require('./clock');
const { ValveControl } = require('./valveControl');

const valveControl = new ValveControl;
valveControl.init();

const clock = new Clock(valveControl);
clock.init();

const wss = new WebSocket.Server({ port: 8080 });

 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // console.log('received: %s', message);
  });
 
  // ws.send('something');
});


app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
  })
)

app.get('/api/v1/schedules', db.getSchedules);
app.post('/api/v1/schedules', db.createSchedule);
app.put('/api/v1/schedules', db.putSchedule);
app.delete('/api/v1/schedules', db.deleteSchedule);

app.put('/api/v1/run_schedule/:id', async (req, res) => {
  let { id } = req.params;

  if (!id) {
    res.status(400).send('invalid id');
    return;
  }
  let nowSchedule = await db.getSingleScheduleToRunNow(id);

  clock.runProgram(nowSchedule);
});

// stopCurrentProgram

app.get('*', (req, res) => {
  console.log(__dirname);
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;

app.listen(port);

console.log('App is listening on port ' + port);

const sendStatus = () => {
  // console.log(clock.getCurrentSchedule());
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({
      zone: valveControl.getCurrentlyOnZone(),
      schedule: clock.getCurrentSchedule()
    }));
  })
}

setInterval(sendStatus, 5000);

