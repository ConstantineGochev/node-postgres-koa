const Router = require('koa-router');
const ctrl = require('../controllers').orders;
const router = new Router();
//const auth = require('../middleware/auth-required-middleware');

router.get('/orders/all', ctrl.all);
router.post('/orders/add-one', ctrl.add_one);
router.put('/orders/update-status', ctrl.update_status);

module.exports = router.routes();
