const pool = require('../config/database');

exports.listar = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar categorías', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const [result] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ message: 'Categoría creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { nombre } = req.body;
    await pool.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
    res.json({ message: 'Categoría actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar la categoría. Puede tener productos asociados.', error: error.message });
  }
};
