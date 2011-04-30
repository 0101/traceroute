fs = require 'fs'

settings = require './settings'


valid = (filename) -> not /\.\./.test filename

respond = (response, code, text) ->
  response.writeHead code
  response.end text

badRequest = (r) -> respond r, 400, 'Bad Request'
notFound   = (r) -> respond r, 404, 'Not Found'


contentTypes =
  gif : 'image/gif'
  png : 'image/png'
  jpg : 'image/jpeg'
  css : 'text/css'
  js  : 'application/javascript'
  html: 'text/html'

getContentType = (filename) ->
  match = /\.(\w+)$/.exec filename
  contentTypes[match[1]] if match


module.exports = (response, filename) ->
  if not valid filename then return badRequest response

  filePath = settings.STATIC_ROOT + filename

  fs.stat filePath, (err, stats) ->
    if err then return notFound response

    contentType = getContentType filename
    encoding = 'utf-8' if contentType is contentTypes['html']

    fs.readFile filePath, encoding, (err, data) ->
      if err then return notFound response

      response.writeHead 200,
        'Content-Type': contentType
        'Content-Length': stats.size
      response.write data
      response.end()
