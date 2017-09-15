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
    res.writeHead(200, {'Content-Type': httpHelpers.getContentType(pathname)});
    res.end(readData.toString());
  }

  if (pathname === '/') {
    //Serve new request
    httpHelpers.serveAssets(res, '/index.html', genericCallback);
  } else if (pathname === '/styles.css') {
    //Serve static asset
    httpHelpers.serveAssets(res, pathname, genericCallback);
  } else {
    httpHelpers.serveAssets(res, '/../../archives/sites.txt', genericCallback);
  }
};
