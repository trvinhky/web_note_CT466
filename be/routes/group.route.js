const router = require("express").Router();
const groupControllers = require('../controllers/group.controller');

router.post('/create', groupControllers.create)
router.put('/edit', groupControllers.edit)
router.delete('/delete', groupControllers.delete)
router.get('/one', groupControllers.getOne)

module.exports = router;