import db from '../config/db.js';

export const actualizarPerfilCandidato = async (idUsuario, datos) => {
    const { nombres, apellidos, direccion, fechaNacimiento } = datos;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute('UPDATE Usuario SET nombres = ?, apellidos = ? WHERE id = ?', [nombres, apellidos, idUsuario]);
        await connection.execute('UPDATE Perfil_Candidato SET direccion = ?, fechaNacimiento = ? WHERE idUsuario = ?', [direccion, fechaNacimiento, idUsuario]);

        await connection.commit();
        return { message: 'Perfil actualizado exitosamente' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const actualizarPerfilEmpresa = async (idUsuario, datos) => {
    const { nombres, apellidos, nombreComercial, descripcion, ubicacion, telefono } = datos;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute('UPDATE Usuario SET nombres = ?, apellidos = ? WHERE id = ?', [nombres, apellidos, idUsuario]);
        await connection.execute('UPDATE Perfil_Empresa SET nombreComercial = ?, descripcion = ?, ubicacion = ?, telefono = ? WHERE idUsuario = ?', [nombreComercial, descripcion, ubicacion, telefono, idUsuario]);

        await connection.commit();
        return { message: 'Perfil de empresa actualizado' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const obtenerTodosLosUsuarios = async () => {
    const sql = `
        SELECT id, nombres, apellidos, email, rol, estado 
        FROM Usuario
    `;
    const [usuarios] = await db.query(sql);
    return usuarios;
};

export const obtenerUsuarioPorId = async (id) => {
    const sql = `
        SELECT id, nombres, apellidos, email, rol, estado 
        FROM Usuario 
        WHERE id = ?
    `;
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    return rows[0];
};