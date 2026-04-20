// Configuración del pool de conexiones a MySQL
// Se exporta el pool para ser usado en los servicios

import mysql from 'mysql2/promise';

// Configuración de la conexión
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Tu usuario de MySQL
    password: 'Admin123', // ¡Pon tu contraseña aquí!
    database: 'portal_trabajos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión inicial
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Conexión a la base de datos "portal_trabajos" exitosa.');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Revisa que hayas ejecutado el script SQL para crear "portal_trabajos".');
        }
    }
};

testConnection();

export default db;