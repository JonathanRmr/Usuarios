const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { verificarToken, verificarPropietario, verificarAdmin } = require('../middleware/auth');

/**
 * GET /api/usuarios/barberos
 * Lista pública de barberos activos (sin token).
 * Solo devuelve _id y nombres — no expone emails ni datos sensibles.
 * Necesaria para que clientes puedan elegir barbero al reservar cita.
 */
router.get('/barberos', UsuarioController.listarBarberos);

/**
 * GET /api/usuarios
 * Listar usuarios (solo admin)
 */
router.get('/', verificarToken, verificarAdmin, UsuarioController.listarUsuarios);

/**
 * GET /api/usuarios/:id
 * Obtener usuario por ID
 */
router.get('/:id', verificarToken, UsuarioController.obtenerUsuario);

/**
 * PUT /api/usuarios/:id
 * Actualizar usuario (solo propietario o admin)
 */
router.put(
    '/:id',
    verificarToken,
    verificarPropietario,
    UsuarioController.actualizarUsuario
);

/**
 * DELETE /api/usuarios/:id
 * Eliminar usuario (solo propietario o admin)
 */
router.delete(
    '/:id',
    verificarToken,
    verificarPropietario,
    UsuarioController.eliminarUsuario
);

/**
 * POST /api/usuarios/:id/cambiar-contrasena
 * Cambiar contraseña
 */
router.post(
    '/:id/cambiar-contrasena',
    verificarToken,
    verificarPropietario,
    UsuarioController.cambiarContrasena
);

/**
 * POST /api/usuarios/:id/verificar-email
 * Verificar email
 */
router.post(
    '/:id/verificar-email',
    UsuarioController.verificarEmail
);

/**
 * PATCH /api/usuarios/:id/rol
 * Cambiar tipo de usuario (solo admin)
 */
router.patch(
    '/:id/rol',
    verificarToken,
    verificarAdmin,
    UsuarioController.cambiarRol
);

module.exports = router;