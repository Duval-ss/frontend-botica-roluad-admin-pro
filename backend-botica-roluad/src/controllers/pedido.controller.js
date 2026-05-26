const pool = require('../config/database');

function generarCodigoPedido() {
  return `ROL-${Date.now().toString().slice(-8)}`;
}

exports.crear = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      usuario_id = null,
      nombre_cliente,
      email_cliente = null,
      telefono,
      direccion = null,
      referencia = null,
      tipo_entrega,
      documento_cliente = null,
      tipo_documento = null,
      productos
    } = req.body;

    if (!nombre_cliente || !telefono || !tipo_entrega || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos para crear el pedido' });
    }

    if (tipo_entrega === 'DELIVERY' && !direccion) {
      return res.status(400).json({ message: 'La dirección es obligatoria para delivery' });
    }

    await conn.beginTransaction();

    let total = 0;
    const productosVerificados = [];

    for (const item of productos) {
      const [rows] = await conn.query('SELECT id, nombre, precio, stock FROM productos WHERE id = ? AND activo = 1 FOR UPDATE', [item.id]);
      if (rows.length === 0) throw new Error(`Producto no encontrado: ${item.id}`);

      const producto = rows[0];
      const cantidad = Number(item.cantidad || 1);
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero');
      if (producto.stock < cantidad) throw new Error(`Stock insuficiente para ${producto.nombre}`);

      total += Number(producto.precio) * cantidad;
      productosVerificados.push({ ...producto, cantidad });
    }

    const codigo = generarCodigoPedido();
    const [pedidoResult] = await conn.query(
      `INSERT INTO pedidos
      (codigo, usuario_id, nombre_cliente, email_cliente, telefono, direccion, referencia, tipo_entrega, documento_cliente, tipo_documento, total, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
      [
      codigo,
      usuario_id || null,
      nombre_cliente,
      email_cliente,
      telefono,
      direccion,
      referencia,
      tipo_entrega,
      documento_cliente,
      tipo_documento,
      total
    ]
    );

    const pedidoId = pedidoResult.insertId;

    for (const p of productosVerificados) {
      await conn.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, p.id, p.cantidad, p.precio, Number(p.precio) * p.cantidad]
      );

      await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [p.cantidad, p.id]);
    }

    await conn.commit();

    res.status(201).json({
      message: 'Pedido registrado correctamente',
      pedido: { id: pedidoId, codigo, total, estado: 'PENDIENTE' }
    });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  } finally {
    conn.release();
  }
};

exports.misPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC',
      [req.usuario.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

exports.obtenerDetalle = async (req, res) => {
  try {
    const [pedidoRows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (pedidoRows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });

    const [items] = await pool.query(
      `SELECT pi.*, p.nombre, p.imagen
       FROM pedido_items pi
       INNER JOIN productos p ON p.id = pi.producto_id
       WHERE pi.pedido_id = ?`,
      [req.params.id]
    );

    res.json({ ...pedidoRows[0], items });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalle', error: error.message });
  }
};

exports.listarAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY creado_en DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar pedidos', error: error.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estados = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'LISTO_RECOJO', 'ENTREGADO', 'CANCELADO'];
    if (!estados.includes(estado)) return res.status(400).json({ message: 'Estado inválido' });

    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};
