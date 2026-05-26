const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

/**
 * POST /api/auth/registro
 * Registrar nuevo usuario
 */
router.post('/registro', AuthController.registro);

/**
 * POST /api/auth/login
 * Login
 */
router.post('/login', AuthController.login);

/**
 * POST /api/auth/refresh-token
 * Refrescar JWT
 */
router.post('/refresh-token', AuthController.refrescarToken);

/**
 * POST /api/auth/verificar-token
 * Verificar validez del token
 */
router.post('/verificar-token', AuthController.verificarToken);

module.exports = router;