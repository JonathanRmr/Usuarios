const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

    const usuarioSchema = new mongoose.Schema({
    // Información básica
    id: {
        type: String,
        unique: true,
        sparse: true,
    },
    nombres: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6,
        select: false, // No incluir por defecto en queries
    },
    telefono: {
        type: String,
        trim: true,
    },
    apellido: {
        type: String,
        trim: true,
    },
    edad: {
        type: Number,
    },
    ciudad: {
        type: String,
        trim: true,
    },
    estadoCuenta: {
        type: String,
        enum: ['activo', 'inactivo', 'suspendido'],
        default: 'activo',
    },
    tipoUsuario: {
        type: String,
        enum: ['cliente', 'admin', 'vendedor'],
        default: 'cliente',
    },
    
    // Fechas
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    ultimaActualizacion: {
        type: Date,
        default: Date.now,
    },
    ultimaConexion: {
        type: Date,
    },

    // Campos de control
    verificado: {
        type: Boolean,
        default: false,
    },
    tokenVerificacion: {
        type: String,
        select: false,
    },
    resetToken: {
        type: String,
        select: false,
    },
    resetTokenExpira: {
        type: Date,
        select: false,
    },
    }, {
    timestamps: false, // Usamos nuestros propios campos de fecha
    });

    // ==================== MÉTODOS ====================

    // Hash de contraseña antes de guardar
    usuarioSchema.pre('save', async function() {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('contrasena')) return;

    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    });

    // Método para comparar contraseñas
    usuarioSchema.methods.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
    };

    // Método para obtener perfil público (sin datos sensibles)
    usuarioSchema.methods.perfilPublico = function() {
    const usuario = this.toObject();
    delete usuario.contrasena;
    delete usuario.tokenVerificacion;
    delete usuario.resetToken;
    delete usuario.resetTokenExpira;
    return usuario;
    };

    // Actualizar timestamp al modificar
    usuarioSchema.pre('findByIdAndUpdate', function(next) {
    this.set({ ultimaActualizacion: new Date() });
    next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);