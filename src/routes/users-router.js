const Router = require('koa-router');
const ctrl = require('../controllers').users;
const router = new Router();

const auth = require("../middleware/auth-required-middleware")

router.post("/users/login", ctrl.login)
router.get("/user", auth, ctrl.get)
module.exports = router.routes();