const router = require("express").Router();
const userController = require('../controllers/user.controller')

router.post('/create', userController.create)
router.post('/login', userController.login)
router.get('/count', userController.getCount)
router.get('/search/:userEmail', userController.search)
router.get('/info/:id', userController.getOne)
router.put('/:id', userController.edit)

module.exports = router;