require('dotenv').config();

const morgan = require('morgan');
const express = require('express');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', routes);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
