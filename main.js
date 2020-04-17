console.log('Loading ... \n')
const bot = require('./config/twitter');
const api = require('./api');
const CronJob = require('cron').CronJob;

var job = new CronJob('00 55 00 * * *', function () {

    api.getMessage()
	.then(res => bot.thread(res))

	console.log("JOB EXECUTED!")

},
    null,
    true, //Ativa o job
    'America/Sao_Paulo' //Fuso horário.
);