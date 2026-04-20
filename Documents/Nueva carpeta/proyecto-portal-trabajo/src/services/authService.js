import bcrypt from 'bcrypt';
import db from '../config/db.js';

/**
 * Registra un nuevo Postulante (Candidato)
 */
export const registrarPostulante = async (datos) => {
    const { nombres, apellidos, email, password, dui, fechaNacimiento, direccion } = datos;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener el ID binario del rol 'postulante'
        const [roles] = await connection.execute('SELECT id FROM Roles WHERE nombreRol = "postulante"');
        if (roles.length === 0) throw new Error("El rol 'postulante' no existe en la base de datos.");
        const idRolBin = roles[0].id;

        // 2. Crear el Usuario usando UUID_TO_BIN(UUID())
        const sqlUser = `
            INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, 'postulante', 'activo')
        `;
        const [resUser] = await connection.execute(sqlUser, [idRolBin, nombres, apellidos, email, hashedPassword]);
        
        // 3. Recuperar el ID que se acaba de crear (MySQL no devuelve insertId con UUID binarios fácilmente)
        const [newUser] = await connection.execute('SELECT id FROM Usuario WHERE email = ?', [email]);
        const idUsuarioBin = newUser[0].id;

        // 4. Crear el Perfil_Candidato
        const sqlPerfil = `
            INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?)
        `;
        await connection.execute(sqlPerfil, [idUsuarioBin, dui, fechaNacimiento, direccion]);

        await connection.commit();
        return { nombres, email, rol: 'postulante' };

    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('El correo o el DUI ya se encuentran registrados');
            err.statusCode = 400;
            throw err;
        }
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Registra un nuevo Empleador (Empresa)
 */
export const registrarEmpleador = async (datos) => {
    const {
        nombres, apellidos, email, password,
        nombreEmpresa, razonSocial, nit, ubicacion, telefono, correoEmpresa, sector, tipoEmpresa, descripcion
    } = datos;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener el ID binario del rol 'empleador'
        const [roles] = await connection.execute('SELECT id FROM Roles WHERE nombreRol = "empleador"');
        if (roles.length === 0) throw new Error("El rol 'empleador' no existe en la base de datos.");
        const idRolBin = roles[0].id;

        // 2. Crear el Usuario
        const sqlUser = `
            INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, 'empleador', 'activo')
        `;
        const [resUser] = await connection.execute(sqlUser, [idRolBin, nombres, apellidos, email, hashedPassword]);

        // 3. Recuperar ID binario del usuario creado
        const [newUser] = await connection.execute('SELECT id FROM Usuario WHERE email = ?', [email]);
        const idUsuarioBin = newUser[0].id;

        // 4. Crear el Perfil_Empresa
        const sqlEmpresa = `
            INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sqlEmpresa, [
            idUsuarioBin, nombreEmpresa, razonSocial, nit, ubicacion, telefono, correoEmpresa, sector, tipoEmpresa, descripcion || ''
        ]);

        await connection.commit();
        return { nombres, empresa: nombreEmpresa, rol: 'empleador' };

    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('El correo o el NIT ya se encuentran registrados');
            err.statusCode = 400;
            throw err;
        }
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Valida las credenciales para el Login
 */
export const validarCredenciales = async (email, password) => {
    // Usamos BIN_TO_UUID para que el ID sea manejable en JS como texto
    const sql = `
        SELECT BIN_TO_UUID(id) AS id, nombres, apellidos, email, passwordHash, rol 
        FROM Usuario 
        WHERE email = ? AND estado = 'activo' 
        LIMIT 1
    `;
    
    const [rows] = await db.query(sql, [email]);
    const usuario = rows[0];

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 401;
        throw error;
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);
    
    if (!passwordCorrecta) {
        const error = new Error('Contraseña incorrecta');
        error.statusCode = 401;
        throw error;
    }

    return {
        id:        usuario.id,
        nombre:    usuario.nombres,
        apellidos: usuario.apellidos || '',
        correo:    usuario.email,
        rol:       usuario.rol
    };
};