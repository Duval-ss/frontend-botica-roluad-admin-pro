const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/dashboard', verificarToken, soloAdmin, admin.dashboard);

module.exports = router;
