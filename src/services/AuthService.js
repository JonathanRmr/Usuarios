const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const UsuarioService = require('./UsuarioService');
const { ValidationError } = require('../utils/customErrors');

class AuthService {
    /**
     * Registrar nuevo usuario
     */
    async registro(email, contrasena, nombres) {
        try {
        const usuario = await UsuarioService.crearUsuario({
            email,
            contrasena,
            nombres,
        });

        // Generar token JWT
        const token = this.generarToken(usuario._id);

        return {
            usuario,
            token,
        };
        } catch (error) {
        throw error;
        }
    }

    /**
     * Login de usuario
     */
    async login(email, contrasena) {
        // Obtener usuario con contraseña
        const usuario = await UsuarioService.obtenerUsuarioPorEmail(email);

        // Verificar contraseña
        const esValida = await usuario.compararContrasena(contrasena);
        if (!esValida) {
        throw new ValidationError('Credenciales inválidas');
        }

        // Registrar conexión
        await UsuarioService.registrarConexion(usuario._id);

        // Generar token
        const token = this.generarToken(usuario._id);

        return {
        usuario: usuario.perfilPublico(),
        token,
        };
    }

    /**
     * Generar JWT
     */
    generarToken(usuarioId) {
        return jwt.sign(
        { usuarioId, iat: Date.now() },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
        );
    }

    /**
     * Verificar JWT
     */
    verificarToken(token) {
        try {
        return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
        throw new ValidationError('Token inválido o expirado');
        }
    }

    /**
     * Refresh token
     */
    refrescarToken(token) {
        const decoded = this.verificarToken(token);
        return this.generarToken(decoded.usuarioId);
    }
}

module.exports = new AuthService();