const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Orígenes permitidos: variable de entorno o wildcard en desarrollo
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : '*';

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — Render lo usa para verificar que el servicio está vivo
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Usuarios API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path,
        method: req.method,
    });
});

// Error handler centralizado
app.use(errorHandler);

module.exports = app;