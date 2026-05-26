const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

function crearToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const [existe] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) return res.status(409).json({ message: 'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol)
       VALUES (?, ?, ?, ?, ?, 'CLIENTE')`,
      [nombre, email, passwordHash, telefono || null, direccion || null]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const usuario = rows[0];
    let passwordValida = false;

    // Normal: contraseñas encriptadas con bcrypt.
    // El usuario admin de prueba del script SQL entra una vez con plain:admin123 y se actualiza automáticamente a bcrypt.
    if (usuario.password?.startsWith('plain:')) {
      passwordValida = usuario.password === `plain:${password}`;
      if (passwordValida) {
        const nuevoHash = await bcrypt.hash(password, 10);
        await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [nuevoHash, usuario.id]);
      }
    } else {
      passwordValida = await bcrypt.compare(password, usuario.password);
    }

    if (!passwordValida) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = crearToken(usuario);

    res.json({
      message: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion, rol, creado_en FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};
