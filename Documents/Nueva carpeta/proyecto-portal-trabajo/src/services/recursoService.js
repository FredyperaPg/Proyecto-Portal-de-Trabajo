import db from '../config/db.js';

export const getRecursos = async ({ tipo, busqueda } = {}) => {
    let sql = `
        SELECT
            BIN_TO_UUID(r.id)   AS id,
            r.titulo,
            r.contenido,
            r.tipo,
            r.estado,
            r.urlBanner,
            r.urlVideo,
            r.fechaPublicacion,
            BIN_TO_UUID(u.id)   AS idUsuario,
            CONCAT(u.nombres, ' ', u.apellidos) AS autor
        FROM Recurso r
        INNER JOIN Usuario u ON r.idUsuario = u.id
        WHERE r.estado = 'publicado'
    `;
    const params = [];
    if (tipo)     { sql += ' AND r.tipo = ?';                  params.push(tipo); }
    if (busqueda) {
        sql += ' AND (r.titulo LIKE ? OR r.contenido LIKE ?)';
        params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    sql += ' ORDER BY r.fechaPublicacion DESC LIMIT 50';
    const [rows] = await db.query(sql, params);
    return rows;
};

export const getRecursoPorId = async (id) => {
    const [rows] = await db.query(`
        SELECT
            BIN_TO_UUID(r.id)   AS id,
            r.titulo,
            r.contenido,
            r.tipo,
            r.urlBanner,
            r.urlVideo,
            r.fechaPublicacion,
            BIN_TO_UUID(u.id)   AS idUsuario,
            CONCAT(u.nombres, ' ', u.apellidos) AS autor
        FROM Recurso r
        INNER JOIN Usuario u ON r.idUsuario = u.id
        WHERE r.id = UUID_TO_BIN(?) AND r.estado = 'publicado' LIMIT 1`, [id]);
    return rows[0] || null;
};

export const crearRecurso = async ({ idUsuario, titulo, contenido, tipo, urlBanner, urlVideo }) => {
    await db.query(
        `INSERT INTO Recurso (id, idUsuario, titulo, contenido, tipo, urlBanner, urlVideo, estado)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?, ?, ?, ?, 'publicado')`,
        [idUsuario, titulo, contenido, tipo, urlBanner || null, urlVideo || null]);
    return { ok: true };
};
