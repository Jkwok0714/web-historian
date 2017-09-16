var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, readData) {
    if (err) {
      throw err;
    }
    callback(readData.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback, res) {
  exports.readListOfUrls(function(data) {
    callback(data.indexOf(url) !== -1, res);
  });
};

exports.addUrlToList = function(url, callback, res) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) {
      throw err;
    } else {
      // console.log('Sent data');
      callback(res);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  //Check if directory exists in archivedSites
  fs.stat(exports.paths.archivedSites + '/' + url, (err, files) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  for (var url of urls) {
    exports.isUrlArchived(url, (exists) => {
      if (!exists) {
        console.log('Downloading', url);
        exports.downloadUrl(url, exports.paths.archivedSites + url, () => {
        });
        // fs.writeFile(exports.paths.archivedSites + '/' + url, 'google', () => {
        //   // console.log('Archived');
        // });
      }
    });
  }
};

exports.downloadUrl = function(url, dest, callback) {
  var output = fs.createWriteStream(dest + '/' + url);
  var req = http.get('http://' + url, (res) => {
    if (res.statusCode === 200) {
      res.pipe(output);
      output.on('finish', () => {
        output.close(callback);
      });
    }
    req.setTimeout(24000, () => {
      req.abort();
    });
  });
};
