import mysql from 'mysql2/promise'; // Importante usar /promise
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'J1A2R3R4',
    database: process.env.DB_NAME || 'portal_trabajo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa (Pool)');
    connection.release();
} catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
}

export default pool;