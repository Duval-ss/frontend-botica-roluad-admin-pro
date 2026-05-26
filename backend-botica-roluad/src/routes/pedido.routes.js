const router = require('express').Router();
const pedido = require('../controllers/pedido.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.post('/', pedido.crear);
router.get('/mis-pedidos', verificarToken, pedido.misPedidos);
router.get('/admin', verificarToken, soloAdmin, pedido.listarAdmin);
router.get('/:id', verificarToken, pedido.obtenerDetalle);
router.patch('/:id/estado', verificarToken, soloAdmin, pedido.actualizarEstado);

module.exports = router;
