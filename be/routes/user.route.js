const router = require("express").Router();
const userController = require('../controllers/user.controller')

router.post('/create', userController.create)
router.post('/login', userController.login)
router.get('/info/:id', userController.getOne)

module.exports = router;