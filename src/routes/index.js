const Router = require('koa-router');
const router = new Router();
const api = new Router();

const orders = require('./orders-router');
const products = require('./products-router');
const users = require('./users-router');

api.use(orders);
api.use(products);
api.use(users);

router.use('/api', api.routes());

module.exports = router;