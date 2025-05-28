require('dotenv').config();
const chroma = require('./libs/chroma');

const morgan = require('morgan');
const express = require('express');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', routes);

app.listen(port, async () => {
  await chroma.start();
  console.log(`Server running at http://localhost:${port}`);
});
