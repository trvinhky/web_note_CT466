const router = require("express").Router();
const workInfoControllers = require('../controllers/workInfo.controller')

router.post('/create', workInfoControllers.create)
router.put('/edit', workInfoControllers.edit)
router.delete('/delete', workInfoControllers.delete)
router.get('/info', workInfoControllers.getOne)
router.get('/all', workInfoControllers.getAll)

module.exports = router;