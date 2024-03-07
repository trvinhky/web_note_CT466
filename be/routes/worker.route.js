const router = require("express").Router();
const workerController = require('../controllers/worker.controller')

router.post('/create', workerController.create)
router.delete('/delete', workerController.delete)
router.put('/edit', workerController.edit)
router.delete('/delete/:workId', workerController.deleteByWorkId)
router.get('/options', workerController.getAllByUserId)
router.get('/work/:workId', workerController.getWorkerByWorkId)

module.exports = router;