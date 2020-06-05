const config = require('config');
const Koa = require('koa');

const app = new Koa();
app.proxy = true;

app.keys = [config.get('secret')];
require("../schemas")(app)
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const error = require('../middleware/error-middleware');
const cors = require('kcors');
const jwt = require('../middleware/jwt-middleware');
const body_parser = require('koa-bodyparser');
const routes = require('../routes');

app.use(logger());
app.use(helmet());
app.use(
  cors({
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  })
);

app.use(error);
//app.use(jwt);
app.use(
  body_parser({
    enableTypes: ['json']
  })
);

app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;