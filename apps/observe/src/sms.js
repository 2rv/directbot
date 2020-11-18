const app = require('express')();
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', handleInboundSms);

function handleInboundSms(req, res) {
  const twiml = new MessagingResponse();

  twiml.message('Test');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

app.listen(process.env.PORT || 3000, () => {
  console.log('started');
});
