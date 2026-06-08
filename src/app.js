const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware global
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        service: 'Usuarios API',
        timestamp: new Date().toISOString()
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
        method: req.method
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;