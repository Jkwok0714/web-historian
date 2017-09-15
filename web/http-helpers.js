var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(__dirname + '/public' + asset, function(err, readData) {
    if (err) {
      throw err;
    } else {
      callback(res, readData);
    }
  });
};

exports.getContentType = function(pathname) {
  var extension = pathname.split('.').pop();
  switch (extension) {
  case 'css':
    return 'text/css';
    break;
  case 'html':
    return 'text/html';
    break;
  case 'txt':
    return 'text/plain';
    break;
  default:
    return 'text/plain';
    break;
  }
};

// As you progress, keep thinking about what helper functions you can put here!
