const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const salaRoutes = require('./routes/salaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/reservas', reservaRoutes);

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    estado: 'ok',
    mensaje: 'API Reservas Salas 2 MVC funcionando correctamente'
  });
});

// Ruta de prueba para verificar API
app.get('/api/test', (req, res) => {
  res.status(200).json({
    estado: 'ok',
    mensaje: 'Endpoint de prueba activo'
  });
});

module.exports = app;