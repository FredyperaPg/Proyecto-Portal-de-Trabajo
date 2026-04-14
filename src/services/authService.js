// Servicio: authService
// Contiene las consultas SQL para esta funcionalidad
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const registrarPostulante = async (datos) => {
    const { nombres, apellidos, correo, password, dui, fechaNacimiento, direccion, telefono } = datos;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const sqlUser = `
            INSERT INTO Usuario (idRol, nombres, apellidos, email, passwordHash, rol)
            VALUES (3, ?, ?, ?, ?, 'postulante')
        `;
        const [resUser] = await connection.execute(sqlUser, [nombres, apellidos, correo, hashedPassword]);
        const idUsuario = resUser.insertId;

        const sqlPerfil = `
            INSERT INTO Perfil_Candidato (idUsuario, dui, fechaNacimiento, direccion)
            VALUES (?, ?, ?, ?)
        `;
        await connection.execute(sqlPerfil, [idUsuario, dui, fechaNacimiento, direccion]);

        await connection.commit();
        return { id: idUsuario, nombres, correo };

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

export const registrarEmpleador = async (datos) => {
    const {
        nombres, apellidos, correo, password,
        nombreEmpresa, razonSocial, nit, ubicacion, telefono, correoEmpresa, sector, tipoEmpresa, descripcion
    } = datos;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const sqlUser = `
            INSERT INTO Usuario (idRol, nombres, apellidos, email, passwordHash, rol)
            VALUES (2, ?, ?, ?, ?, 'empleador')
        `;
        const [resUser] = await connection.execute(sqlUser, [nombres, apellidos, correo, hashedPassword]);
        const idUsuario = resUser.insertId;

        const sqlEmpresa = `
            INSERT INTO Perfil_Empresa (idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sqlEmpresa, [
            idUsuario, nombreEmpresa, razonSocial, nit, ubicacion, telefono, correoEmpresa, sector, tipoEmpresa, descripcion || ''
        ]);

        await connection.commit();
        return { id: idUsuario, nombres, empresa: nombreEmpresa };

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

export const validarCredenciales = async (email, password) => {
    const sql = `
        SELECT u.id, u.nombres, u.email, u.passwordHash, u.rol, r.nombreRol 
        FROM Usuario u
        JOIN Roles r ON u.idRol = r.id
        WHERE u.email = ? AND u.estado = 'activo'
    `;

    const [usuarios] = await db.query(sql, [email]);
    const usuario = usuarios[0];

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
        id: usuario.id,
        nombres: usuario.nombres,
        email: usuario.email,
        rol: usuario.rol,
        tipo: usuario.nombreRol
    };
};