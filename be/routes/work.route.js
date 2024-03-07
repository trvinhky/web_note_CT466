const router = require("express").Router();
const workController = require('../controllers/work.controller')

router.post('/create', workController.create)
router.put('/edit', workController.edit)
router.delete('/delete', workController.delete)
router.get('/info/:id', workController.getOne)

module.exports = router;