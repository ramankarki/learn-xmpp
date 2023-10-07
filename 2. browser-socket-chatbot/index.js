const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.all('*', (req, res) => {
  res.status(404).end()
})

const server = app.listen(3005, () => console.log('running on 3005'))

const Primus = require('primus')
const options = { transformer: 'websockets' }
const primus = new Primus(server, options)
const Xmpp = require('xmpp-ftw')
primus.use('emitter', require('primus-emitter'))

primus.on('connection', (socket) => {
  console.log('New websocket connection')
  const xmpp = new Xmpp.Xmpp(socket)
  socket.xmpp = xmpp
  socket.on('xmpp.login', console.log)
})

primus.on('disconnection', (socket) => {
  console.log('Websocket disconnected, logging user out')
  socket.xmpp.logout()
})

primus.save(path.join(process.cwd(), 'public', 'scripts', 'primus.js'))
