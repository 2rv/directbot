const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/message', handleInboundSms);

function handleInboundSms(req, res) {
  console.log('req.body', req.body);
  console.log('msgFrom', req.body.From);
  console.log('msgBody', req.body.Body);

  res.send(`
    <Response>
      <Message>
        Hello ${req.body.From}. You said: ${req.body.Body}
      </Message>
    </Response>
  `);
}

app.listen(process.env.PORT || 3000);
