const Router = require('koa-router');
const ctrl = require('../controllers').products;
const router = new Router();

//const auth = require('../middleware/auth-required-middleware');
router.param("id", ctrl.by_id)
router.get('/products/', ctrl.get);
router.post('/products/', ctrl.post);
router.put('/products/:id', ctrl.put);
router.del('/products/:id', ctrl.del);

module.exports = router.routes();