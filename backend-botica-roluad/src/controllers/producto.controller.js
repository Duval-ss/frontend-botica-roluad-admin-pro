const pool = require('../config/database');

exports.listar = async (req, res) => {
  try {
    const { q = '', categoria = '' } = req.query;
    const params = [];
    let sql = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1
    `;

    if (q) {
      sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (categoria) {
      sql += ' AND p.categoria_id = ?';
      params.push(categoria);
    }

    sql += ' ORDER BY p.nombre ASC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar productos', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen, categoria_id } = req.body;
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Nombre, precio y stock son obligatorios' });
    }

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, stock, imagen || null, categoria_id || null]
    );

    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen, categoria_id, activo } = req.body;
    await pool.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, categoria_id = ?, activo = ?
       WHERE id = ?`,
      [nombre, descripcion || null, precio, stock, imagen || null, categoria_id || null, activo ?? 1, req.params.id]
    );

    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

exports.desactivar = async (req, res) => {
  try {
    await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto desactivado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};
