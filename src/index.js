/** @format */

// const http = require('serverless-http');

require('dotenv').config();

const app = require('./app');
const connect = require('./connect');

connect(process.env.DB)
  .then(() =>
    app.listen(4000, () => {
      console.log('server running on http://localhost:4000');
    })
  )
  .catch((e) => console.error(e));

// module.exports.handler = http(app);
