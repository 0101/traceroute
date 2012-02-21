(function() {
  var everyone, fs, http, nowjs, parse, serve_static, server, settings, traceroute;
  fs = require('fs');
  http = require('http');
  parse = require('url').parse;
  nowjs = require('now');
  traceroute = require('./traceroute');
  serve_static = require('./servestatic');
  settings = require('./settings');
  server = http.createServer(function(request, response) {
    var file, url;
    url = parse(request.url);
    if (url.pathname === '/') {
      return serve_static(response, 'index.html');
    } else {
      file = url.pathname.replace(/^\//, '');
      return serve_static(response, file);
    }
  });
  server.listen(settings.PORT);
  everyone = nowjs.initialize(server);
  everyone.now.run = function(target) {
    var client, id;
    client = this.now;
    id = 'output' + Math.floor(Math.random() * 1000000000);
    client.startOutput(id);
    return traceroute.run({
      host: target,
      onData: function(data) {
        return client.output(id, String(data), target);
      },
      onError: function(data) {
        return client.error(id, String(data), target);
      },
      onExit: function(code) {
        client.output(id, '\ndone.\n');
        return client.endOutput(id);
      }
    });
  };
}).call(this);
