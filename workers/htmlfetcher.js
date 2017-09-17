// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var cron = require('node-cron');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var archive = require('../helpers/archive-helpers');

console.log('begin');
var task = cron.schedule('*/10 * * * * *', () => {
  console.log('Cronned' + archive.paths.list);
  // archive.readListOfUrls((list) => {
  //   console.log(list);
  //   list.pop();
  //   archive.downloadUrls(list);
    // console.log('Triggered download');
  // });


  // archive.readListOfUrlsAsync()
  //   .then( function(list) {
  //     console.log('are we in first then');
  //     list.pop();
  //     return archive.downloadUrlsAsync(list);
  //   });

  fs.readFileAsync(archive.paths.list).then((readData) => {
    var list = readData.toString().split('\n');
    list.pop();
    archive.downloadUrls(list);
  }).catch((err) => console.error(err));
    // .catch((error) => console.error('error', error));
});

task.start();
