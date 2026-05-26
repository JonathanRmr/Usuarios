const AuthService = require('../services/AuthService');
const { ValidationError } = require('../utils/customErrors');

/**
 * Middleware para verificar JWT
 * Extrae el token del header Authorization y lo valida
 */
const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ValidationError('Token no proporcionado');
        }

        const token = authHeader.substring(7); // Remover "Bearer "
        const decoded = AuthService.verificarToken(token);

        // Almacenar datos en el request
        req.usuarioId = decoded.usuarioId;
        req.usuario = decoded;

        next();
    } catch (error) {
        res.status(401).json({
        success: false,
        error: 'No autorizado',
        detalles: error.message,
        });
    }
};

/**
 * Middleware para verificar que el usuario sea administrador
 */
const verificarAdmin = async (req, res, next) => {
    try {
        const Usuario = require('../models/Usuario');
        const usuario = await Usuario.findById(req.usuarioId);

        if (!usuario || usuario.tipoUsuario !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Se requieren permisos de administrador',
        });
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware para verificar que sea el mismo usuario o admin
 */
const verificarPropietario = async (req, res, next) => {
    try {
        const Usuario = require('../models/Usuario');
        const usuario = await Usuario.findById(req.usuarioId);

        const esAdmin = usuario && usuario.tipoUsuario === 'admin';
        const esMismo = req.usuarioId === req.params.id;

        if (!esAdmin && !esMismo) {
        return res.status(403).json({
            success: false,
            error: 'No tienes permiso para acceder a este recurso',
        });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verificarToken,
    verificarAdmin,
    verificarPropietario,
};