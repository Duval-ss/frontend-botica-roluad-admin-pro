const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Botica ROLUAD funcionando correctamente' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/categorias', require('./routes/categoria.routes'));
app.use('/api/pedidos', require('./routes/pedido.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use("/api/consulta", require("./routes/consulta.routes"));
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
