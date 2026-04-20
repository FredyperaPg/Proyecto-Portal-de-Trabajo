import db from '../config/db.js';

export const getPublicaciones = async ({ busqueda } = {}) => {
    let sql = `
        SELECT
            BIN_TO_UUID(p.id)       AS id,
            p.titulo,
            p.contenido,
            p.cantidadLikes,
            p.creadoEl,
            BIN_TO_UUID(u.id)       AS idUsuario,
            CONCAT(u.nombres, ' ', u.apellidos) AS autor,
            u.urlFoto               AS avatarAutor,
            (SELECT COUNT(*) FROM Comentario_Foro c WHERE c.idPublicacion = p.id) AS totalComentarios
        FROM Publicacion_Foro p
        INNER JOIN Usuario u ON p.idUsuario = u.id
    `;
    const params = [];
    if (busqueda) {
        sql += ' WHERE p.titulo LIKE ? OR p.contenido LIKE ?';
        params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    sql += ' ORDER BY p.creadoEl DESC LIMIT 50';
    const [rows] = await db.query(sql, params);
    return rows;
};

export const getPublicacionPorId = async (id) => {
    const [rows] = await db.query(`
        SELECT
            BIN_TO_UUID(p.id)       AS id,
            p.titulo,
            p.contenido,
            p.cantidadLikes,
            p.creadoEl,
            BIN_TO_UUID(u.id)       AS idUsuario,
            CONCAT(u.nombres, ' ', u.apellidos) AS autor,
            u.urlFoto               AS avatarAutor
        FROM Publicacion_Foro p
        INNER JOIN Usuario u ON p.idUsuario = u.id
        WHERE p.id = UUID_TO_BIN(?) LIMIT 1`, [id]);
    return rows[0] || null;
};

export const getComentariosPorPublicacion = async (idPublicacion) => {
    const [rows] = await db.query(`
        SELECT
            BIN_TO_UUID(c.id)       AS id,
            c.contenido,
            c.creadoEl,
            BIN_TO_UUID(u.id)       AS idUsuario,
            CONCAT(u.nombres, ' ', u.apellidos) AS autor,
            u.urlFoto               AS avatarAutor
        FROM Comentario_Foro c
        INNER JOIN Usuario u ON c.idUsuario = u.id
        WHERE c.idPublicacion = UUID_TO_BIN(?)
        ORDER BY c.creadoEl ASC`, [idPublicacion]);
    return rows;
};

export const crearPublicacion = async ({ idUsuario, titulo, contenido }) => {
    await db.query(
        `INSERT INTO Publicacion_Foro (id, idUsuario, titulo, contenido)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?)`,
        [idUsuario, titulo, contenido]);
    return { ok: true };
};

export const crearComentario = async ({ idUsuario, idPublicacion, contenido }) => {
    await db.query(
        `INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
        [idUsuario, idPublicacion, contenido]);
    return { ok: true };
};

export const darLike = async (id) => {
    await db.query(
        `UPDATE Publicacion_Foro SET cantidadLikes = cantidadLikes + 1 WHERE id = UUID_TO_BIN(?)`,
        [id]);
    return { ok: true };
};
