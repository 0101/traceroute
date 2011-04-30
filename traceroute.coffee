spawn = require('child_process').spawn


exports.run = (kwargs) ->
  traceroute = spawn 'traceroute', [kwargs.host]
  traceroute.stdout.on 'data', kwargs.onData
  traceroute.stderr.on 'data', kwargs.onError
  traceroute.on 'exit', kwargs.onExit
