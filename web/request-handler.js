var path = require('path');
var url = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  console.log('Handling a', req.method, 'request with path', pathname);
  var genericCallback = (res, readData) => {
    // console.log('Attempting to send request');
    res.writeHead(200, {'Content-Type': httpHelpers.getContentType(pathname)});
    res.end(readData.toString());
  };

  if (req.method === 'POST') {
    var data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // console.log(chunk.toString());
    });
    req.on('end', () => {
      archive.addUrlToList(data.split('=').pop(), (res) => {
        httpHelpers.serveAssets(res, '/index.html', (res, readData) => {
          // console.log('Attempting to send request');
          res.writeHead(302, {'Content-Type': 'text/html'});
          res.end(readData.toString());
        });
      }, res);
    });
  } else if (req.method === 'GET') {
    if (pathname === '/') {
      httpHelpers.serveAssets(res, '/index.html', (res, readData) => {
        // console.log('Attempting to send request');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(readData.toString());
      });
    } else if (pathname === '/styles.css') {
      httpHelpers.serveAssets(res, pathname, genericCallback);
    } else if (pathname === '/www.google.com') {
      fs.readFile(archive.paths.archivedSites + pathname, (err, files) => {
        if (err) {
          throw err;
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(files.toString());
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end();
    }

    // httpHelpers.serveAssets(res, '/../../archives/sites.txt', genericCallback);
  }
};
