const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/registrar', auth.registrar);
router.post('/login', auth.login);
router.get('/perfil', verificarToken, auth.perfil);

module.exports = router;
