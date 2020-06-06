const Router = require('koa-router');
const ctrl = require('../controllers').orders;
const router = new Router();
//const auth = require('../middleware/auth-required-middleware');

router.param("id", ctrl.by_id)
router.get('/orders/', ctrl.get);
router.post('/orders/', ctrl.post);
router.put('/orders/:id', ctrl.put);

module.exports = router.routes();