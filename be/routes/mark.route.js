const router = require("express").Router();
const markController = require('../controllers/mark.controller')

router.post('/create', markController.create)
router.get('/all', markController.getAll)
router.delete('/:id', markController.delete)

module.exports = router;