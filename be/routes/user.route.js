const router = require("express").Router();
const userControllers = require('../controllers/user.controller')

router.post('/create', userControllers.create)
router.post('/login', userControllers.login)
router.get('/search', userControllers.search)
router.get('/info', userControllers.getInfo)

module.exports = router;