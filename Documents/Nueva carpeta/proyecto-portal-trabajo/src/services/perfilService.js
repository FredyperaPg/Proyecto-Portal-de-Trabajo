// Servicio: perfilService
import db from '../config/db.js';

// ── POSTULANTE ────────────────────────────────────────────────────────────────

/**
 * Obtiene el perfil completo del candidato (usuario + Perfil_Candidato)
 */
export const getPerfilPostulante = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(u.id)    AS id,
            u.nombres,
            u.apellidos,
            u.email,
            u.urlFoto,
            u.creadoEl,
            BIN_TO_UUID(pc.id)   AS idCandidato,
            pc.dui,
            pc.fechaNacimiento,
            pc.direccion,
            pc.titulo,
            pc.profesion,
            pc.anosExperiencia
        FROM Usuario u
        LEFT JOIN Perfil_Candidato pc ON pc.idUsuario = u.id
        WHERE u.id = UUID_TO_BIN(?)
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows[0] || null;
};

/**
 * Actualiza los datos del perfil candidato
 */
export const updatePerfilPostulante = async (idUsuario, datos) => {
    const { nombres, apellidos, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia } = datos;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(
            'UPDATE Usuario SET nombres=?, apellidos=? WHERE id=UUID_TO_BIN(?)',
            [nombres, apellidos, idUsuario]
        );

        await connection.execute(
            `UPDATE Perfil_Candidato
             SET dui=?, fechaNacimiento=?, direccion=?, titulo=?, profesion=?, anosExperiencia=?
             WHERE idUsuario=UUID_TO_BIN(?)`,
            [dui, fechaNacimiento, direccion, titulo || null, profesion || null, anosExperiencia || 0, idUsuario]
        );

        await connection.commit();
        return { ok: true };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// ── EMPRESA ───────────────────────────────────────────────────────────────────

/**
 * Obtiene el perfil completo de la empresa por idUsuario
 */
export const getPerfilEmpresa = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(u.id)    AS idUsuario,
            u.nombres,
            u.apellidos,
            u.email,
            BIN_TO_UUID(pe.id)   AS idEmpresa,
            pe.nombreComercial,
            pe.razonSocial,
            pe.nit,
            pe.ubicacion,
            pe.telefono,
            pe.correoContacto,
            pe.sector,
            pe.tipoEmpresa,
            pe.descripcion,
            pe.urlLogo,
            pe.urlBanner,
            pe.creadoEl
        FROM Usuario u
        INNER JOIN Perfil_Empresa pe ON pe.idUsuario = u.id
        WHERE u.id = UUID_TO_BIN(?)
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows[0] || null;
};

/**
 * Actualiza datos de la empresa
 */
export const updatePerfilEmpresa = async (idUsuario, datos) => {
    const { nombreComercial, razonSocial, nit, ubicacion, telefono,
            correoContacto, sector, tipoEmpresa, descripcion } = datos;

    await db.query(
        `UPDATE Perfil_Empresa
         SET nombreComercial=?, razonSocial=?, nit=?, ubicacion=?, telefono=?,
             correoContacto=?, sector=?, tipoEmpresa=?, descripcion=?
         WHERE idUsuario=UUID_TO_BIN(?)`,
        [nombreComercial, razonSocial, nit, ubicacion, telefono,
         correoContacto, sector, tipoEmpresa, descripcion || null, idUsuario]
    );
    return { ok: true };
};

// ── ADMIN STATS ───────────────────────────────────────────────────────────────

/**
 * Contadores para el dashboard de Admin
 */
export const getAdminStats = async () => {
    const [[{ totalPostulantes }]] = await db.query(
        "SELECT COUNT(*) AS totalPostulantes FROM Usuario WHERE rol = 'postulante' AND estado = 'activo'"
    );
    const [[{ totalEmpresas }]] = await db.query(
        "SELECT COUNT(*) AS totalEmpresas FROM Usuario WHERE rol = 'empleador' AND estado = 'activo'"
    );
    const [[{ totalEmpleos }]] = await db.query(
        "SELECT COUNT(*) AS totalEmpleos FROM Empleo WHERE estado = 'abierta'"
    );
    const [[{ totalUsuarios }]] = await db.query(
        "SELECT COUNT(*) AS totalUsuarios FROM Usuario WHERE estado = 'activo'"
    );
    return { totalPostulantes, totalEmpresas, totalEmpleos, totalUsuarios };
};

/**
 * Lista todos los usuarios para el panel Admin
 */
export const getUsuarios = async () => {
    const [rows] = await db.query(`
        SELECT
            BIN_TO_UUID(id) AS id,
            nombres, apellidos, email, rol, estado, creadoEl
        FROM Usuario
        ORDER BY creadoEl DESC
        LIMIT 100
    `);
    return rows;
};

/**
 * Obtiene un usuario por ID con su perfil extendido
 */
export const getUsuarioPorId = async (id) => {
    const [rows] = await db.query(`
        SELECT BIN_TO_UUID(u.id) AS id, u.nombres, u.apellidos,
               u.email, u.rol, u.estado, u.urlFoto, u.creadoEl
        FROM Usuario u
        WHERE u.id = UUID_TO_BIN(?) LIMIT 1`, [id]);
    return rows[0] || null;
};

/**
 * Cambia el estado de un usuario (activo / inactivo)
 */
export const updateEstadoUsuario = async (id, estado) => {
    await db.query(`UPDATE Usuario SET estado=? WHERE id=UUID_TO_BIN(?)`, [estado, id]);
    return { ok: true };
};
