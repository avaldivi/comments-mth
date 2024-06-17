const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const DataAccessObject = require('./dataAccessObject');
const Comment = require('./comment');
const { WebSocketServer } = require('ws');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataAccessObject = new DataAccessObject('./database.sqlite3');
const comment = new Comment(dataAccessObject);

// real-time communication
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

comment.createTable().catch((error) => {
  console.log(`Error: ${JSON.stringify(error)}`);
});

app.post('/createComment', function (request, response) {
  const { body } = request;
  comment
    .createComment(body)
    .then((result) => {
      broadcast({ type: 'NEW_COMMENT', data: result });
      response.send(result);
    })
    .catch(() => {
      response.status(500).send({ error: 'Failed to create comment' });
    });
});

app.get('/getComment', function (request, response) {
  const { body } = request;
  const { id } = body;
  comment.getComment(id).then((result) => {
    response.send(result);
  });
});

app.get('/getComments', function (request, response) {
  comment.getComments().then((result) => {
    response.send(result);
  });
});

app.delete('/deleteComments', function (request, response) {
  comment.deleteComments().then((result) => {
    response.send(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  const rootDir = __dirname.replace('/server', '');
  response.sendFile(`${rootDir}/src/index.html`);
});
