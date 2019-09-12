const express = require('express');
const path = require('path');
const db = require('./queries');
const bodyParser = require('body-parser')

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
  })
)


app.get('/api/v1/get_week', db.getWeek);

app.get('/api/v1/get_schedules', db.getSchedules);
app.post('/api/v1/create_schedule', db.createSchedule);

app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;

app.listen(port);

console.log('App is listening on port ' + port);
