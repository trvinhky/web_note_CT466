const router = require("express").Router();
const workControllers = require('../controllers/work.controller')

router.post('/create', workControllers.create)
router.put('/edit', workControllers.edit)
router.delete('/delete', workControllers.delete)

module.exports = router;