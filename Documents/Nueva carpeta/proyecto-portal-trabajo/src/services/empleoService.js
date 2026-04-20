// Servicio: empleoService
import db from '../config/db.js';

/**
 * Obtiene todos los empleos activos con datos de la empresa
 */
export const getEmpleosActivos = async ({ categoria, modalidad, ubicacion, busqueda } = {}) => {
    let sql = `
        SELECT 
            BIN_TO_UUID(e.id)        AS id,
            e.titulo,
            e.descripcion,
            e.categoria,
            e.modalidad,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.vacantes,
            e.estado,
            e.fechaVencimiento,
            e.creadoEl,
            BIN_TO_UUID(e.idEmpresa) AS idEmpresa,
            pe.nombreComercial       AS nombreEmpresa,
            pe.urlLogo               AS logoEmpresa
        FROM Empleo e
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.estado = 'abierta'
    `;
    const params = [];

    if (categoria) { sql += ' AND e.categoria = ?';              params.push(categoria); }
    if (modalidad) { sql += ' AND e.modalidad = ?';              params.push(modalidad); }
    if (ubicacion) { sql += ' AND e.ubicacion LIKE ?';           params.push(`%${ubicacion}%`); }
    if (busqueda)  { sql += ' AND (e.titulo LIKE ? OR e.descripcion LIKE ?)'; params.push(`%${busqueda}%`, `%${busqueda}%`); }

    sql += ' ORDER BY e.creadoEl DESC LIMIT 50';

    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Obtiene un empleo por ID
 */
export const getEmpleoPorId = async (id) => {
    const sql = `
        SELECT 
            BIN_TO_UUID(e.id)        AS id,
            e.titulo,
            e.descripcion,
            e.requisitos,
            e.funciones,
            e.categoria,
            e.modalidad,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.vacantes,
            e.estado,
            e.fechaVencimiento,
            e.creadoEl,
            BIN_TO_UUID(e.idEmpresa) AS idEmpresa,
            pe.nombreComercial       AS nombreEmpresa,
            pe.descripcion           AS descripcionEmpresa,
            pe.urlLogo               AS logoEmpresa,
            pe.sector,
            pe.ubicacion             AS ubicacionEmpresa
        FROM Empleo e
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.id = UUID_TO_BIN(?) AND e.estado = 'abierta'
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
};

/**
 * Crea un nuevo empleo (usado por empresa)
 */
export const crearEmpleo = async (datos) => {
    const { idEmpresa, titulo, descripcion, requisitos, funciones, categoria, modalidad, ubicacion,
            salarioMin, salarioMax, vacantes, fechaVencimiento } = datos;

    const sql = `
        INSERT INTO Empleo (id, idEmpresa, titulo, descripcion, requisitos, funciones,
                            categoria, modalidad, ubicacion, salarioMin, salarioMax, vacantes, fechaVencimiento, estado)
        VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'abierta')
    `;
    await db.query(sql, [idEmpresa, titulo, descripcion, requisitos, funciones,
                         categoria, modalidad, ubicacion, salarioMin, salarioMax, vacantes, fechaVencimiento]);
    return { titulo, estado: 'abierta' };
};

/**
 * Empleos publicados por una empresa específica (VISTA_22 y VISTA_23)
 */
export const getEmpleosDeEmpresa = async (idEmpresa) => {
    const sql = `
        SELECT
            BIN_TO_UUID(e.id)   AS id,
            e.titulo,
            e.categoria,
            e.modalidad,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.vacantes,
            e.estado,
            e.fechaVencimiento,
            e.creadoEl,
            (SELECT COUNT(*) FROM Postulacion p WHERE p.idEmpleo = e.id) AS totalPostulaciones
        FROM Empleo e
        WHERE e.idEmpresa = UUID_TO_BIN(?)
        ORDER BY e.creadoEl DESC
    `;
    const [rows] = await db.query(sql, [idEmpresa]);
    return rows;
};

/**
 * Cambia el estado de un empleo (abierta / cerrada / pausada)
 */
export const updateEstadoEmpleo = async (id, estado) => {
    await db.query(
        "UPDATE Empleo SET estado=? WHERE id=UUID_TO_BIN(?)",
        [estado, id]
    );
    return { ok: true };
};
