require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API de Usuarios corriendo en puerto ${PORT}`);
        console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch((error) => {
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Error no manejado:', reason);
});