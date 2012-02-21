(function() {
  var badRequest, contentTypes, fs, getContentType, notFound, respond, settings, valid;
  fs = require('fs');
  settings = require('./settings');
  valid = function(filename) {
    return !/\.\./.test(filename);
  };
  respond = function(response, code, text) {
    response.writeHead(code);
    return response.end(text);
  };
  badRequest = function(r) {
    return respond(r, 400, 'Bad Request');
  };
  notFound = function(r) {
    return respond(r, 404, 'Not Found');
  };
  contentTypes = {
    gif: 'image/gif',
    png: 'image/png',
    jpg: 'image/jpeg',
    css: 'text/css',
    js: 'application/javascript',
    html: 'text/html'
  };
  getContentType = function(filename) {
    var match;
    match = /\.(\w+)$/.exec(filename);
    if (match) {
      return contentTypes[match[1]];
    }
  };
  module.exports = function(response, filename) {
    var filePath;
    if (!valid(filename)) {
      return badRequest(response);
    }
    filePath = settings.STATIC_ROOT + filename;
    return fs.stat(filePath, function(err, stats) {
      var contentType, encoding;
      if (err) {
        return notFound(response);
      }
      contentType = getContentType(filename);
      if (contentType === contentTypes['html']) {
        encoding = 'utf-8';
      }
      return fs.readFile(filePath, encoding, function(err, data) {
        if (err) {
          return notFound(response);
        }
        response.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': stats.size
        });
        response.write(data);
        return response.end();
      });
    });
  };
}).call(this);
