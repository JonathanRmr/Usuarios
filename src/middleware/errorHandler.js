const { ValidationError, NotFoundError, AuthenticationError } = require('../utils/customErrors');

const errorHandler = (error, req, res, next) => {
    console.error('Error:', error.message);

    // Errores personalizados
    if (error instanceof ValidationError) {
        return res.status(400).json({
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
        });
    }

    if (error instanceof NotFoundError) {
        return res.status(404).json({
        success: false,
        error: error.message,
        code: 'NOT_FOUND',
        });
    }

    if (error instanceof AuthenticationError) {
        return res.status(401).json({
        success: false,
        error: error.message,
        code: 'AUTHENTICATION_ERROR',
        });
    }

    // Errores de Mongoose
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
        return res.status(500).json({
        success: false,
        error: 'Error en la base de datos',
        code: 'DATABASE_ERROR',
        });
    }

    if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({
        success: false,
        error: 'Validación fallida',
        detalles: mensajes,
        code: 'VALIDATION_ERROR',
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
        success: false,
        error: 'ID inválido',
        code: 'INVALID_ID',
        });
    }

    // Error genérico
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
    });
};

module.exports = { errorHandler };