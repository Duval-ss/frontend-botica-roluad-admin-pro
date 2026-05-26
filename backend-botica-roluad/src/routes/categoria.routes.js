const router = require('express').Router();
const categoria = require('../controllers/categoria.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/', categoria.listar);
router.post('/', verificarToken, soloAdmin, categoria.crear);
router.put('/:id', verificarToken, soloAdmin, categoria.actualizar);
router.delete('/:id', verificarToken, soloAdmin, categoria.eliminar);

module.exports = router;
