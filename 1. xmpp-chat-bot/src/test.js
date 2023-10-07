const { client, xml } = require('@xmpp/client')

const xmpp = client({
  service: 'localhost',
  resource: 'echo',
  credentials: {
    username: 'test',
    password: 'test',
  },
})

xmpp.on('error', (err) => {
  console.error(err)
})

xmpp.on('offline', (data) => {
  console.log('offline')
})

xmpp.on('stanza', async (stanza) => {
  const from = stanza.getAttr('from') + ':'
  switch (stanza.name) {
    case 'message':
      return console.log(stanza.toString(), '\n')
    case 'presence':
      if (stanza.attr('from').startsWith('test@localhost')) return
      return console.log(stanza.toString(), '\n')
  }
})

xmpp.on('online', async (info) => {
  console.log(info)
  await xmpp.send(xml('presence', {}, xml('show', {}, 'available')))
  // await xmpp.send(xml('presence', { type: 'subscribe', to: 'bot@localhost' }))
})

process.stdin.on('data', async (data) => {
  const input = data.toString().trim()
  await xmpp.send(
    xml(
      'message',
      { from: 'test@localhost', to: 'bot@localhost', type: 'chat' },
      xml('body', {}, input)
    )
  )
})

xmpp.start().catch(console.error)
