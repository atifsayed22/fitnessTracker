const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addLog, getLogs } = require('../controllers/logController');

const router = express.Router();

router.use(authMiddleware);

router.post('/add', addLog);
router.get('/', getLogs);

module.exports = router;