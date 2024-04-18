const router = require("express").Router();
const groupInfoControllers = require('../controllers/groupInfo.controller');

router.post('/create', groupInfoControllers.create)
router.put('/edit', groupInfoControllers.edit)
router.delete('/delete', groupInfoControllers.delete)
router.post('/add', groupInfoControllers.addMember)
router.get('/one', groupInfoControllers.getOne)
router.get('/by', groupInfoControllers.getByUser)

module.exports = router;