console.log(socket)

socket.on('xmpp.connection', function (details) {
  $('p.connection-status').html('Online')
})

socket.on('xmpp.error', function (error) {
  if ('auth' === error.type) {
    return alert('Authentication failed')
  }
})

$('button[name="login"]').click(function () {
  var jid = $('input[name="jid"]').val()
  var password = $('input[name="password"]').val()
  if (!jid || !password) {
    return alert('Please enter connection details')
  }
  var options = { jid: jid, password: password }
  console.log(options)
  socket.send('xmpp.login', options)
})
