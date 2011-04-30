fs = require 'fs'
http = require 'http'
parse = require('url').parse
nowjs = require 'now'

traceroute = require './traceroute'
serve_static = require './servestatic'
settings = require './settings'


server = http.createServer (request, response) ->
  url = parse request.url
  if url.pathname is '/'
    serve_static response, 'index.html'
  else
    file = url.pathname.replace(/^\//, '')
    serve_static response, file

server.listen settings.PORT

everyone = nowjs.initialize server


everyone.now.run = (target) ->
  client = this.now
  id = 'output' + Math.floor Math.random() * 1000000000
  client.startOutput(id)
  traceroute.run
    host: target
    onData: (data) -> client.output id, String data
    onError: (data) -> client.error id, String data
    onExit: (code) ->
      client.output id, '\ndone.\n'
      client.endOutput id
