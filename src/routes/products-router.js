const Router = require('koa-router');
const ctrl = require('../controllers').products;
const router = new Router();

//const auth = require('../middleware/auth-required-middleware');
router.get('/products/all', ctrl.all);
router.post('/products/add-one', ctrl.add_one);
router.put('/products/update-one', ctrl.update_one);
router.del('/products/delete-one', ctrl.delete_one);

module.exports = router.routes();
