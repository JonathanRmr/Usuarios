const AuthService = require('../services/AuthService');
const Joi = require('joi');

// Esquemas de validación
const schemaRegistro = Joi.object({
    email: Joi.string().email().required(),
    contrasena: Joi.string().min(6).required(),
    nombres: Joi.string().min(2).required(),
}).unknown(false);

const schemaLogin = Joi.object({
    email: Joi.string().email().required(),
    contrasena: Joi.string().required(),
}).unknown(false);

class AuthController {
    /**
     * POST /api/auth/registro
     * Registrar nuevo usuario
     */
    async registro(req, res, next) {
        try {
        // Validar datos
        const { error, value } = schemaRegistro.validate(req.body);
        if (error) {
            return res.status(400).json({
            success: false,
            error: error.details[0].message,
            });
        }

        const { email, contrasena, nombres } = value;
        const resultado = await AuthService.registro(email, contrasena, nombres);

        res.status(201).json({
            success: true,
            data: {
            usuario: resultado.usuario,
            token: resultado.token,
            },
            mensaje: 'Usuario registrado correctamente',
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * POST /api/auth/login
     * Login de usuario
     */
    async login(req, res, next) {
        try {
        // Validar datos
        const { error, value } = schemaLogin.validate(req.body);
        if (error) {
            return res.status(400).json({
            success: false,
            error: error.details[0].message,
            });
        }

        const { email, contrasena } = value;
        const resultado = await AuthService.login(email, contrasena);

        res.json({
            success: true,
            data: {
            usuario: resultado.usuario,
            token: resultado.token,
            },
            mensaje: 'Sesión iniciada correctamente',
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * POST /api/auth/refresh-token
     * Refrescar JWT
     */
    async refrescarToken(req, res, next) {
        try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
            success: false,
            error: 'Token requerido',
            });
        }

        const nuevoToken = AuthService.refrescarToken(token);

        res.json({
            success: true,
            data: {
            token: nuevoToken,
            },
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * POST /api/auth/verificar-token
     * Verificar que un token es válido
     */
    async verificarToken(req, res, next) {
        try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
            success: false,
            error: 'Token requerido',
            });
        }

        const decoded = AuthService.verificarToken(token);

        res.json({
            success: true,
            data: { id: decoded.id, tipoUsuario: decoded.tipoUsuario },
        });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new AuthController();