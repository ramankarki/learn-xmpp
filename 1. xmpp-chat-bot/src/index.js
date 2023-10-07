const { client, xml, jid } = require('@xmpp/client')
const ddg = require('ddg')

const xmpp = client({
  service: 'localhost',
  resource: 'echo',
  credentials: {
    username: 'bot',
    password: 'bot',
  },
})

xmpp.on('error', (err) => {
  console.error(err)
})

xmpp.on('offline', (data) => {
  console.log('offline')
})

xmpp.on('stanza', async (stanza) => {
  switch (stanza.name) {
    case 'presence':
      return handlePresence(stanza)
    case 'message':
      return handleMessage(stanza)
  }
})

xmpp.on('online', async (info) => {
  xmpp.send(xml('presence', {}, xml('show', {}, 'available')))
  await xmpp.send(
    xml(
      'presence',
      {
        from: 'bot@localhost/laptop-bot',
        to: 'gang@muc.localhost/laptop',
      },
      xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
    )
  )
  console.log(info)
})

xmpp.start().catch(console.error)

const NS_CHAT_STATE = 'http://jabber.org/protocol/chatstates'
const sendChatState = (to, state) => {
  console.log('Sending chat state: ', to)
  xmpp.send(
    xml('message', { type: 'chat', to }, xml(state, { xmlns: NS_CHAT_STATE }))
  )
}

function handlePresence(stanza) {
  if (stanza.attr('type') !== 'subscribe') return
  xmpp
    .send(xml('presence', { type: 'subscribed', to: stanza.attr('from') }))
    .then(() => console.log('subscriber', stanza.attr('from')))
}

// const handleMessage = (stanza) => {
//   const query = stanza.getChildText('body')
//   if (!query) return /* Not a chat message */
//   const to = stanza.attr('from')
//   console.log(to + ':', query)

//   sendChatState(to, 'active')
//   sendChatState(to, 'composing')
//   ddg.query(query, (error, data) => {
//     let result
//     if (error) {
//       result = 'Unfortunately we could not answer your request'
//     } else {
//       if (!data.RelatedTopics[0]) {
//         result = 'Sorry, there were no results!'
//       } else {
//         const item = data.RelatedTopics[0]
//         result = item.FirstURL + '\n' + item.Text
//       }
//     }
//     xmpp.send(
//       xml(
//         'message',
//         { type: 'chat', to },
//         xml('body', {}, result),
//         xml('inactive', { xmlns: NS_CHAT_STATE })
//       )
//     )
//   })
// }

/**
 * muc - multi user chat
 */
const handleMessage = function (stanza) {
  console.log(stanza.toString())
  let query = stanza.getChildText('body')
  if (!query) return /* Not a chat message */
  const from = stanza.attr('from')
  const type = stanza.attr('type')
  const isMessageFromChatRoom = 0 === from.indexOf('bot@muc.localhost')
  console.log({ isMessageFromChatRoom })
  const sendChatStateNotifications =
    'groupchat' !== type && !isMessageFromChatRoom
  if ('groupchat' === type) {
    if (0 !== query.indexOf('answer-bot:')) {
      return /* Not for us to respond to */
    }
    query = query.replace('answer-bot: ', '')
  }
  console.log(query)
  if (sendChatStateNotifications) sendChatState(from, 'active')
  ddg.query(query, function (error, data) {
    if (sendChatStateNotifications) sendChatState(from, 'composing')
    const result = null
    if (error) {
      result = 'Unfortunately we could not answer your request'
    } else {
      if (!data.RelatedTopics[0]) {
        result = 'Sorry, there were no results!'
      } else {
        const item = data.RelatedTopics[0]
        result = item.FirstURL + '\n' + item.Text
      }
    }
    let responsePrefix = ''
    if (isMessageFromChatRoom && 'groupchat' === type) {
      responsePrefix = jid.getResource() + ': '
      from = jid.bare()
    }
    console.log('Sending response: ' + reply.root().toString())
    xmpp.send(
      xml(
        'message',
        { type: 'chat', to: from },
        xml('body', {}, responsePrefix + result),
        sendChatStateNotifications
          ? xml('inactive', { xmlns: NS_CHAT_STATE })
          : ''
      )
    )
  })
}
