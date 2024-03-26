const router = require("express").Router();
const workController = require('../controllers/work.controller')

router.post('/create', workController.create)
router.put('/edit', workController.edit)
router.put('/edit-status', workController.editStatus)
router.delete('/delete/:id', workController.delete)
router.get('/info/:id', workController.getOne)
router.get('/all', workController.getAll)
router.get('/current', workController.getAllCurrent)

module.exports = router;