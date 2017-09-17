var path = require('path');
var url = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var validUrl = require('valid-url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  console.log('Handling a', req.method, 'request with path', pathname);
  var genericCallback = (res, readData) => {
    // console.log('Attempting to send request');
    res.writeHead(200, {'Content-Type': httpHelpers.getContentType(pathname)});
    res.end(readData.toString());
  };

  console.log('pathname', pathname, 'of', req.url);
  if (req.method === 'POST') {
    var data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // console.log(chunk.toString());
    });
    // console.log(data);
    req.on('end', () => {
      var cleanedUrl = data.split('=').pop();
      archive.isUrlInList(cleanedUrl, (result, res) => {
        if (!result) {
          archive.addUrlToList(cleanedUrl, (res) => {
            httpHelpers.serveAssets(res, '/index.html', (res, readData) => {
              // console.log('Attempting to send request');
              res.writeHead(302, {'Content-Type': 'text/html'});
              res.end(readData.toString());
            });
          }, res);
        } else {
          console.log('URL exists');
        }
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
    } else {
      var slicedPath = pathname.slice(1);
      archive.isUrlArchived(slicedPath, (exists) => {
        if (exists) {
          console.log('Getting ' + slicedPath +' @', archive.paths.archivedSites + pathname);
          fs.readFile(archive.paths.archivedSites + pathname, (err, files) => {
            if (err) {
              throw err;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(files.toString());
          });
        } else {
          console.log('Not archived, but listed');
          archive.isUrlInList(slicedPath, (exists) => {
            if (exists) {
              httpHelpers.serveAssets(res, '/loading.html', (res, readData) => {
                // console.log('Attempting to send request');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(readData.toString());
              });
            } else {
              if (validUrl.isUri('http://' + url)) {
                archive.addUrlToList(slicedPath, (res) => {
                  httpHelpers.serveAssets(res, '/loading.html', (res, readData) => {
                    // console.log('Attempting to send request');
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(readData.toString());
                  });
                }, res);
              } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end();
              }
            }
          }, res);
        }
      });
    }

    // httpHelpers.serveAssets(res, '/../../archives/sites.txt', genericCallback);
  }
};
