const Usuario = require('../models/Usuario');
const { ValidationError, NotFoundError } = require('../utils/customErrors');

class UsuarioService {
    /**
     * Crear nuevo usuario
     */
    async crearUsuario(datos) {
        // Verificar que el email no exista
        const usuarioExistente = await Usuario.findOne({ email: datos.email });
        if (usuarioExistente) {
            throw new ValidationError('El email ya está registrado');
        }

        try {
            const usuario = new Usuario(datos);
            await usuario.save();
            return usuario.perfilPublico();
        } catch (error) {
            if (error.code === 11000) {
                throw new ValidationError('El email ya está registrado');
            }
            throw error;
        }
    }

    /**
     * Obtener usuario por ID
     */
    async obtenerUsuarioPorId(id) {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }
        return usuario.perfilPublico();
    }

    /**
     * Obtener usuario por email (para autenticación)
     */
    async obtenerUsuarioPorEmail(email) {
        const usuario = await Usuario.findOne({ email }).select('+contrasena');
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }
        return usuario;
    }

    /**
     * Actualizar usuario
     */
    async actualizarUsuario(id, datos) {
        // No permitir actualizar campos sensibles
        delete datos.contrasena;
        delete datos.email;
        delete datos.tokenVerificacion;

        const usuario = await Usuario.findByIdAndUpdate(
    id,
    { ...datos, ultimaActualizacion: new Date() },
    { returnDocument: 'after', runValidators: true }  // ✅
);

        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }

        return usuario.perfilPublico();
    }
    /**
     * Cambiar el tipo de usuario (rol). Solo para admins.
     */
    async cambiarTipoUsuario(id, nuevoTipo) {
        const tiposValidos = ['cliente', 'barbero', 'admin'];
        if (!tiposValidos.includes(nuevoTipo)) {
            throw new ValidationError(
                `Tipo de usuario inválido. Debe ser uno de: ${tiposValidos.join(', ')}`
            );
        }

        const usuario = await Usuario.findByIdAndUpdate(
    id,
    { tipoUsuario: nuevoTipo, ultimaActualizacion: new Date() },
    { returnDocument: 'after', runValidators: true }  // ✅
);

        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }

        return usuario.perfilPublico();
    }

    /**
     * Eliminar usuario
     */
    async eliminarUsuario(id) {
        const usuario = await Usuario.findByIdAndDelete(id);
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }
        return { mensaje: 'Usuario eliminado correctamente' };
    }

    /**
     * Listar usuarios con paginación
     */
    async listarUsuarios(pagina = 1, limite = 10, filtros = {}) {
        const saltar = (pagina - 1) * limite;

        // Construir query de filtros
        const query = {};
        if (filtros.tipoUsuario) query.tipoUsuario = filtros.tipoUsuario;
        if (filtros.estadoCuenta) query.estadoCuenta = filtros.estadoCuenta;
        if (filtros.ciudad) query.ciudad = filtros.ciudad;

        const [usuarios, total] = await Promise.all([
            Usuario.find(query)
                .select('-contrasena -tokenVerificacion -resetToken')
                .skip(saltar)
                .limit(limite)
                .sort({ fechaCreacion: -1 }),
            Usuario.countDocuments(query),
        ]);

        return {
            datos: usuarios,
            paginacion: {
                pagina,
                limite,
                total,
                totalPaginas: Math.ceil(total / limite),
            },
        };
    }

    /**
     * Cambiar contraseña
     */
    async cambiarContrasena(id, contrasenaActual, contrasenaNueva) {
        const usuario = await Usuario.findById(id).select('+contrasena');
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }

        const esValida = await usuario.compararContrasena(contrasenaActual);
        if (!esValida) {
            throw new ValidationError('Contraseña actual incorrecta');
        }

        usuario.contrasena = contrasenaNueva;
        await usuario.save();

        return { mensaje: 'Contraseña actualizada correctamente' };
    }

    /**
     * Verificar email
     */
    async verificarEmail(id, token) {
        const usuario = await Usuario.findById(id).select('+tokenVerificacion');
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }

        if (usuario.tokenVerificacion !== token) {
            throw new ValidationError('Token de verificación inválido');
        }

        usuario.verificado = true;
        usuario.tokenVerificacion = null;
        await usuario.save();

        return { mensaje: 'Email verificado correctamente' };
    }

    /**
     * Registrar conexión del usuario
     */
    async registrarConexion(id) {
        await Usuario.findByIdAndUpdate(id, {
            ultimaConexion: new Date(),
        });
    }
}

module.exports = new UsuarioService();