const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:5280/xmpp-websocket', 'xmpp', {
  headers: {
    // Authorization: 'Basic ' + Buffer.from('bot:bot').toString('base64'),
  },
})

ws.on('connection', console.log)

ws.on('open', () => {
  console.log('Connected to Prosody WebSocket')
  // Perform further actions after successful connection
})

ws.on('online', (data) => console.log(data))

ws.on('stanza', console.log)

ws.on('message', (message) => {
  console.log('Received:', Buffer.from(message).toString('utf8'))
})

ws.on('close', () => {
  console.log('Connection closed')
})
