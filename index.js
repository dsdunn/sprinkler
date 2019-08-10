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

app.get('/api/v1/getList', (req,res) => {
	let list = ['item1', 'item2','item3'];
	res.json(list);
	console.log('Sent list of items');
});

app.get('/api/v1/get_days', db.getDays);

app.get('/api/v1/get_programs', db.getPrograms);

app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.post('/api/v1/create_program', db.createProgram)

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
