const router = require('express').Router();
const producto = require('../controllers/producto.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/', producto.listar);
router.get('/:id', producto.obtenerPorId);
router.post('/', verificarToken, soloAdmin, producto.crear);
router.put('/:id', verificarToken, soloAdmin, producto.actualizar);
router.delete('/:id', verificarToken, soloAdmin, producto.desactivar);

module.exports = router;
