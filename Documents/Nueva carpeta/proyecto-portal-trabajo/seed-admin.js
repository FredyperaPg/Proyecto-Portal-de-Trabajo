/**
 * seed-admin.js — Crea el usuario administrador con contraseña encriptada
 * 
 * Uso: node seed-admin.js
 * Requiere que el servidor MySQL esté activo y las variables .env configuradas.
 */

import bcrypt from 'bcrypt';
import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_EMAIL    = 'fredyperazag28@gmail.com';
const ADMIN_PASSWORD = '12345678';
const ADMIN_NOMBRES  = 'Fredy';
const ADMIN_APELLIDOS = 'Peraza';

async function seedAdmin() {
    const db = await mysql2.createConnection({
        host:     process.env.DB_HOST     || 'localhost',
        user:     process.env.DB_USER     || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME     || 'portal_trabajos',
    });

    console.log('✅  Conectado a MySQL');

    try {
        // 1. Verificar que el rol admin existe
        const [roles] = await db.execute("SELECT id FROM Roles WHERE nombreRol = 'admin' LIMIT 1");
        if (roles.length === 0) {
            console.error('❌  El rol "admin" no existe. Ejecuta BD_Script.sql primero.');
            process.exit(1);
        }
        const idRolBin = roles[0].id;

        // 2. Verificar si el admin ya existe
        const [existe] = await db.execute("SELECT id FROM Usuario WHERE email = ?", [ADMIN_EMAIL]);
        if (existe.length > 0) {
            console.log('ℹ️   El usuario admin ya existe. Actualizando contraseña...');
            const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await db.execute("UPDATE Usuario SET passwordHash = ? WHERE email = ?", [hash, ADMIN_EMAIL]);
            console.log('✅  Contraseña actualizada correctamente');
            console.log(`📧  Email: ${ADMIN_EMAIL}`);
            console.log(`🔑  Contraseña: ${ADMIN_PASSWORD}`);
            await db.end();
            return;
        }

        // 3. Generar hash de contraseña
        console.log('🔐  Generando hash bcrypt (cost=10)...');
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // 4. Insertar usuario admin
        await db.execute(`
            INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, 'admin', 'activo')
        `, [idRolBin, ADMIN_NOMBRES, ADMIN_APELLIDOS, ADMIN_EMAIL, passwordHash]);

        console.log('✅  Usuario administrador creado exitosamente');
        console.log('══════════════════════════════════════════');
        console.log(`📧  Email:      ${ADMIN_EMAIL}`);
        console.log(`🔑  Contraseña: ${ADMIN_PASSWORD}`);
        console.log(`👤  Nombre:     ${ADMIN_NOMBRES} ${ADMIN_APELLIDOS}`);
        console.log(`🛡️   Rol:        admin`);
        console.log('══════════════════════════════════════════');
        console.log('🚀  Ahora puedes iniciar sesión en /login');

    } catch (err) {
        console.error('❌  Error:', err.message);
    } finally {
        await db.end();
    }
}

seedAdmin();
