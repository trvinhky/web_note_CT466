const router = require("express").Router();
const workControllers = require('../controllers/work.controller')

router.post('/create', workControllers.create)
router.put('/edit', workControllers.edit)
router.delete('/delete', workControllers.delete)
router.get('/all', workControllers.getAll)
router.get('/current', workControllers.getAllCurrent)

module.exports = router;