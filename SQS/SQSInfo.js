const express = require('express');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');

const app = express();
app.use(bodyParser.json());

app.use('/signup', signupRoute);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
