// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var cron = require('node-cron');
var archive = require('../helpers/archive-helpers');

console.log('begin');
var task = cron.schedule('*/10 * * * * *', () => {
  // console.log('Cronned' + archive.paths.list);
  // archive.downloadUrls();
  archive.readListOfUrls((list) => {
    console.log(list);
    list.pop();
    archive.downloadUrls(list);
    // console.log('Triggered download');
  });
});

task.start();
