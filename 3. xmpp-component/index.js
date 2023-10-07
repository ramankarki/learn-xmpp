const { component, xml, jid } = require('@xmpp/component')

const xmpp = component({
  service: 'xmpp://localhost:5347',
  // domain: 'component.localhost',
  // password: 'mysecretcomponentpassword',
})

xmpp.on('open', (el) => console.log(el))

xmpp.on('error', (err) => {
  console.error(err)
})

xmpp.on('offline', () => {
  console.log('offline')
})

xmpp.on('stanza', async (stanza) => {
  console.log(stanza)
})

xmpp.on('online', async (info) => {
  console.log('online as', info)
})

xmpp.start().catch(console.error)
