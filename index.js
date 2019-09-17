const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();

const db = require('./queries');
const clock = require('./clock');

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

// getCurrentProgram (maybe push with web-socket to live updates/ count-down?)
// stopCurrentProgram

app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;

app.listen(port);

console.log('App is listening on port ' + port);

const mainLoop = new clock.Clock()

mainLoop.init();
