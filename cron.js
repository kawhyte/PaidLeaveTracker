let cron = require('node-cron');
//import {runCron}  from './getAndSaveJson'

 cron.schedule('* * * * * *', () => {
    console.log('running a cron every minute');

    runCron();
 
  });

  module.exports = cron