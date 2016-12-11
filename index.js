const express = require('express');
const bodyParser = require('body-parser');
const Telegram = require('node-telegram-bot-api');
const bot = require('./bot');

const token = process.env.NODE_BOT_TOKEN || '***';
const port = process.env.PORT || 8888;
const app = express();
app.use(bodyParser.json());

const telegram = init(token);

app.get('/', function (req, res) {
  res.json({ version: '1.0' });
});

app.post('/' + token, function (req, res) {
  telegram.processUpdate(req.body);
  res.sendStatus(200);
});

const server = app.listen(port, function () {
  console.log('listen', port);
});

function init(token){
	var telegram;
	if(process.env.NODE_ENV === 'production') {
	  telegram = new Telegram(token);
	  telegram.setWebHook(process.env.HEROKU_URL + token);
	} else {
	  telegram = new Telegram(token, { polling: true });
	}

	telegram.on('message',(msg)=>{
		bot.processMessage(telegram,msg);
	});
	return telegram;
}