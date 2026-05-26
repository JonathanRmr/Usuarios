# API de Usuarios - Microservicio Shared-Nothing

API REST para gestión de usuarios con autenticación JWT, construida con Express y MongoDB Atlas.

## Características

- Autenticación con JWT
- Registro y login de usuarios
- Gestión de usuarios (CRUD)
-  Hash seguro de contraseñas con bcrypt
-  Validación de datos con Joi
- Manejo centralizado de errores
- Paginación
- Middleware de autenticación y autorización
- Arquitectura Shared-Nothing

##  Instalación

### Requisitos previos
- Node.js >= 14
- MongoDB Atlas (base de datos)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd usuarios-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/usuarios_db
JWT_SECRET=tu_clave_super_secreta
PORT=5000
```

4. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

##  Endpoints

### Autenticación

#### Registro
```http
POST /api/auth/registro
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "miContraseña123",
  "nombres": "Juan Pérez"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "_id": "123abc",
      "email": "usuario@example.com",
      "nombres": "Juan Pérez"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "miContraseña123"
}
```

#### Refrescar Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "token": "token_anterior"
}
```

### Usuarios

#### Listar Usuarios (Admin)
```http
GET /api/usuarios?pagina=1&limite=10&tipoUsuario=cliente
Authorization: Bearer <token>
```

#### Obtener Usuario
```http
GET /api/usuarios/:id
Authorization: Bearer <token>
```

#### Actualizar Usuario
```http
PUT /api/usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombres": "Juan Carlos",
  "telefono": "3001234567",
  "ciudad": "Bogotá"
}
```

#### Cambiar Contraseña
```http
POST /api/usuarios/:id/cambiar-contrasena
Authorization: Bearer <token>
Content-Type: application/json

{
  "contrasenaActual": "contraseña123",
  "contrasenaNueva": "nuevaContraseña456"
}
```

#### Eliminar Usuario
```http
DELETE /api/usuarios/:id
Authorization: Bearer <token>
```

##  Arquitectura

### Estructura de carpetas
```
src/
├── models/           # Modelos de datos (Mongoose)
├── controllers/      # Lógica de controladores
├── services/         # Lógica de negocio
├── routes/          # Definición de rutas
├── middleware/      # Middlewares (auth, errores)
├── config/          # Configuración (DB)
└── utils/           # Utilidades y errores personalizados
```

### Flujo de datos
```
Request → Router → Middleware Auth → Controller → Service → Model → Database
```

##  Autenticación

La API utiliza **JWT (JSON Web Token)** para autenticación.

### Cómo autenticarse:
1. Enviar credenciales a `/api/auth/login`
2. Recibir token JWT
3. Incluir token en header: `Authorization: Bearer <token>`

### Tokens
- **Duración**: 7 días (configurable en `.env`)
- **Secret**: Guardado en `.env` (`JWT_SECRET`)

##  Base de Datos

### Modelo Usuario
```javascript
{
  _id: ObjectId,
  nombres: String,
  apellido: String,
  email: String (único),
  contrasena: String (hasheada),
  telefono: String,
  edad: Number,
  ciudad: String,
  estadoCuenta: String (activo|inactivo|suspendido),
  tipoUsuario: String (cliente|admin|vendedor),
  verificado: Boolean,
  fechaCreacion: Date,
  ultimaActualizacion: Date,
  ultimaConexion: Date
}
```

##  Integración con otros Microservicios

Esta API implementa **Shared-Nothing**, permitiendo integración con otros microservicios:

### Ejemplo: Consumir desde otra API
```javascript
const axios = require('axios');

// Login para obtener token
const { data } = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'usuario@example.com',
  contrasena: 'contraseña'
});

const token = data.data.token;

// Usar token para obtener datos del usuario
const usuario = await axios.get(
  'http://localhost:5000/api/usuarios/123',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

##  Testing

```bash
npm test
```

##  Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | Conexión a MongoDB Atlas | `mongodb+srv://...` |
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Ambiente | `development` |
| `JWT_SECRET` | Clave secreta JWT | `mi_clave_super_secreta` |
| `JWT_EXPIRY` | Duración del token | `7d` |
| `ALLOWED_ORIGINS` | CORS orígenes permitidos | `http://localhost:3000` |

##  Manejo de Errores

La API retorna errores estructurados:

```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "ERROR_CODE"
}
```

### Códigos de error comunes
- `VALIDATION_ERROR` - Error de validación (400)
- `NOT_FOUND` - Recurso no encontrado (404)
- `AUTHENTICATION_ERROR` - No autenticado (401)
- `DATABASE_ERROR` - Error de base de datos (500)

##  Dependencias

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcrypt**: Hash de contraseñas
- **jsonwebtoken**: JWT
- **joi**: Validación de datos
- **cors**: CORS

## 📄 Licencia

MIT

##  Autor

Tu nombre aquí

---

**Nota**: Esta es una API de MVP. Para producción, considera:
- Implementar rate limiting
- Agregar logging
- Usar HTTPS
- Implementar refresh tokens con rotación
- Agregar 2FA
