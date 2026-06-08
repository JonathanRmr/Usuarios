const UsuarioService = require('../services/UsuarioService');
const Joi = require('joi');

// Esquemas de validación
const schemaActualizarUsuario = Joi.object({
    nombres: Joi.string().min(2).optional(),
    apellido: Joi.string().optional(),
    telefono: Joi.string().optional(),
    ciudad: Joi.string().optional(),
    edad: Joi.number().min(0).optional(),
}).unknown(false);

const schemaListarUsuarios = Joi.object({
    pagina: Joi.number().min(1).optional().default(1),
    limite: Joi.number().min(1).max(100).optional().default(10),
    tipoUsuario: Joi.string().valid('cliente', 'admin', 'barbero').optional(),
    estadoCuenta: Joi.string().valid('activo', 'inactivo', 'suspendido').optional(),
    ciudad: Joi.string().optional(),
});

class UsuarioController {
    /**
* PATCH /api/usuarios/:id/rol
* Cambiar el tipo de usuario (solo admin)
*/
    async cambiarRol(req, res, next) {
        try {
            const { tipoUsuario } = req.body;

            if (!tipoUsuario) {
                return res.status(400).json({
                    success: false,
                    error: 'El campo tipoUsuario es requerido',
                });
            }

            const usuario = await UsuarioService.cambiarTipoUsuario(req.params.id, tipoUsuario);
            res.json({
                success: true,
                data: usuario,
                mensaje: 'Tipo de usuario actualizado correctamente',
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/usuarios/:id
     * Obtener usuario por ID
     */
    async obtenerUsuario(req, res, next) {
        try {
            const usuario = await UsuarioService.obtenerUsuarioPorId(req.params.id);
            res.json({
                success: true,
                data: usuario,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/usuarios/:id
     * Actualizar usuario
     */
    async actualizarUsuario(req, res, next) {
        try {
            // Validar datos
            const { error, value } = schemaActualizarUsuario.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message,
                });
            }

            const usuario = await UsuarioService.actualizarUsuario(req.params.id, value);
            res.json({
                success: true,
                data: usuario,
                mensaje: 'Usuario actualizado correctamente',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/usuarios/:id
     * Eliminar usuario
     */
    async eliminarUsuario(req, res, next) {
        try {
            const resultado = await UsuarioService.eliminarUsuario(req.params.id);
            res.json({
                success: true,
                data: resultado,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/usuarios
     * Listar usuarios con paginación
     */
    async listarUsuarios(req, res, next) {
        try {
            const { error, value } = schemaListarUsuarios.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message,
                });
            }

            const { pagina, limite, ...filtros } = value;
            const resultado = await UsuarioService.listarUsuarios(pagina, limite, filtros);

            res.json({
                success: true,
                ...resultado,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/usuarios/:id/cambiar-contrasena
     * Cambiar contraseña
     */
    async cambiarContrasena(req, res, next) {
        try {
            const { contrasenaActual, contrasenaNueva } = req.body;

            if (!contrasenaActual || !contrasenaNueva) {
                return res.status(400).json({
                    success: false,
                    error: 'Las contraseñas son requeridas',
                });
            }

            const resultado = await UsuarioService.cambiarContrasena(
                req.params.id,
                contrasenaActual,
                contrasenaNueva
            );

            res.json({
                success: true,
                data: resultado,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/usuarios/:id/verificar-email
     * Verificar email
     */
    async verificarEmail(req, res, next) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'Token requerido',
                });
            }

            const resultado = await UsuarioService.verificarEmail(req.params.id, token);
            res.json({
                success: true,
                data: resultado,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UsuarioController();