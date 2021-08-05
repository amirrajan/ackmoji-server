const express  = require('express')
const cors     = require('cors')
const app      = express()
const port     = process.env.PORT || 3000
const path     = require('path')
const lodash   = require('lodash')
const includes = lodash.includes
const filter   = lodash.filter
const map      = lodash.map
const last     = lodash.last

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

let availableEmojis = [
    "thumbs_up",
    "thumbs_down",
    "satisfied",
    "rofl",
    "upside_down_face",
    "sob",
    "joy",
    "exploding_head",
]

let emojiAcks = [];

app.get('/', (req, res) => {
  res.render('index.ejs', { availableEmojis: availableEmojis })
})

function acksFor(userId) {
  return filter(emojiAcks, a => a.userId == userId)
}

function lastAckFor(userId) {
  let allAcks = acksFor(userId)
  if (last(allAcks)) console.log(last(allAcks).at)
  console.log(Date.now())
  return (last(allAcks) || { at: 0 }).at
}

function canAck(userId) {
  if (!userId) return false
  return ((Date.now() - lastAckFor(userId)) > 10)
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

app.post('/ack', (req, res) => {
  let userId = req.body.userId
  let emoji = req.body.emoji
  console.log(userId, emoji)
  if (canAck(userId) && includes(availableEmojis, emoji)) {
    emojiAcks.push({ id: uuid(), userId, emoji: emoji, at: Date.now() })
  }
  res.send("ok")
})

app.get('/acks', (req, res) => {
  if (!req.query.asOf) res.json({ asOf: Date.now(), acks: [] })

  else {
    let asOf = parseInt(req.query.asOf)
    let acksAsOf = filter(emojiAcks, a => a.at > asOf)
    res.json({ asOf: Date.now(), acks: acksAsOf })
  }
});

app.get('/as-of', (req, res) => {
  res.json({ at: Date.now() })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
