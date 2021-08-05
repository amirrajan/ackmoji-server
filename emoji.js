import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { search } from './lib/words';

const app = express();
let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);

let emojiAcks = [];
let availableEmojis = [
  ":-P",
  "XD",
  "^_^",
  "Orz",
  ":confused:",
  ":sadpanda:",
  "lol",
  "rofl",
  "LMAFO",
  ":poop:",
  "T_T"
];

const dictionary = JSON.parse(
  fs.readFileSync('./lib/dictionary.json')
).dictionary;

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('api/index', {
    availableEmojis: availableEmojis,
    req: req
  });
});

app.get('/api/ack', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: "ok" }));
});

app.post('/api/ack', (req, res) => {
  console.log('wtf....');
  console.log(req);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: "ok" }));
});

app.listen(process.env.PORT || 3000);

console.log('Listening on port: ' + (process.env.PORT || 3000));
