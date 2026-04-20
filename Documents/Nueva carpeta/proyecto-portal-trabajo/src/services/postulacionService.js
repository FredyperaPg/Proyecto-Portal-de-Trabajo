// Servicio: postulacionService
import db from '../config/db.js';

/**
 * Crea una nueva postulación (candidato aplica a empleo)
 */
export const crearPostulacion = async (idCandidato, idEmpleo) => {
    // Verificar si ya existe
    const [exist] = await db.query(
        'SELECT id FROM Postulacion WHERE idCandidato=UUID_TO_BIN(?) AND idEmpleo=UUID_TO_BIN(?)',
        [idCandidato, idEmpleo]
    );
    if (exist.length > 0) {
        const err = new Error('Ya has aplicado a esta oferta');
        err.statusCode = 409;
        throw err;
    }

    await db.query(
        `INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), 'pendiente')`,
        [idCandidato, idEmpleo]
    );
    return { ok: true };
};

/**
 * Lista las postulaciones de un candidato (Mis Aplicaciones - VISTA_17)
 */
export const getMisPostulaciones = async (idCandidato) => {
    const sql = `
        SELECT
            BIN_TO_UUID(p.id)        AS id,
            p.estado,
            p.creadoEl               AS fechaPostulacion,
            BIN_TO_UUID(e.id)        AS idEmpleo,
            e.titulo                 AS tituloEmpleo,
            e.modalidad,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            pe.nombreComercial       AS nombreEmpresa,
            pe.urlLogo               AS logoEmpresa
        FROM Postulacion p
        INNER JOIN Empleo e         ON p.idEmpleo   = e.id
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa  = pe.id
        WHERE p.idCandidato = UUID_TO_BIN(?)
        ORDER BY p.creadoEl DESC
    `;
    const [rows] = await db.query(sql, [idCandidato]);
    return rows;
};

/**
 * Lista las postulaciones recibidas por una empresa (para VISTA_25 y VISTA_26)
 */
export const getPostulacionesPorEmpresa = async (idEmpresa, idEmpleo = null) => {
    let sql = `
        SELECT
            BIN_TO_UUID(p.id)         AS id,
            p.estado,
            p.creadoEl                AS fechaPostulacion,
            BIN_TO_UUID(pc.id)        AS idCandidato,
            u.nombres,
            u.apellidos,
            u.email,
            pc.titulo                 AS tituloCandidato,
            pc.anosExperiencia,
            BIN_TO_UUID(e.id)         AS idEmpleo,
            e.titulo                  AS tituloEmpleo
        FROM Postulacion p
        INNER JOIN Perfil_Candidato pc ON p.idCandidato = pc.id
        INNER JOIN Usuario u           ON pc.idUsuario   = u.id
        INNER JOIN Empleo e            ON p.idEmpleo     = e.id
        WHERE e.idEmpresa = UUID_TO_BIN(?)
    `;
    const params = [idEmpresa];
    if (idEmpleo) { sql += ' AND e.id = UUID_TO_BIN(?)'; params.push(idEmpleo); }
    sql += ' ORDER BY p.creadoEl DESC';

    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Actualiza el estado de una postulación (empresa acepta/rechaza)
 */
export const updateEstadoPostulacion = async (idPostulacion, estado) => {
    const estadosValidos = ['pendiente', 'revisando', 'aceptada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
        const err = new Error('Estado no válido');
        err.statusCode = 400;
        throw err;
    }
    await db.query(
        'UPDATE Postulacion SET estado=? WHERE id=UUID_TO_BIN(?)',
        [estado, idPostulacion]
    );
    return { ok: true };
};

/**
 * Mis aplicaciones buscando por idUsuario (más fácil desde el frontend)
 */
export const getMisAplicacionesPorUsuario = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(p.id)        AS id,
            BIN_TO_UUID(e.id)        AS idEmpleo,
            p.estado,
            p.creadoEl               AS fechaPostulacion,
            e.titulo                 AS tituloEmpleo,
            e.modalidad,
            e.ubicacion,
            pe.nombreComercial       AS nombreEmpresa
        FROM Postulacion p
        INNER JOIN Perfil_Candidato pc ON p.idCandidato = pc.id
        INNER JOIN Empleo e  ON p.idEmpleo = e.id
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE pc.idUsuario = UUID_TO_BIN(?)
        ORDER BY p.creadoEl DESC
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows;
};
