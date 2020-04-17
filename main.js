console.log('Loading ... \n')
const bot = require('./config/twitter');
const api = require('./api');
const CronJob = require('cron').CronJob;

api.getMessage()
.then(res => bot.thread(res))