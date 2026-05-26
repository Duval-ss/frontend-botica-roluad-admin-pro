const pool = require('../config/database');

exports.dashboard = async (req, res) => {
  try {
    const [[productos]] = await pool.query('SELECT COUNT(*) AS total FROM productos WHERE activo = 1');
    const [[pedidos]] = await pool.query('SELECT COUNT(*) AS total FROM pedidos');
    const [[usuarios]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'CLIENTE'");
    const [[ventas]] = await pool.query("SELECT COALESCE(SUM(total), 0) AS total FROM pedidos WHERE estado <> 'CANCELADO'");

    res.json({
      productos: productos.total,
      pedidos: pedidos.total,
      usuarios: usuarios.total,
      ventas: Number(ventas.total)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en dashboard', error: error.message });
  }
};
