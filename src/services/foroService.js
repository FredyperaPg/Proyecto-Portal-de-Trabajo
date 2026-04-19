// Servicio: foroService
// Contiene las consultas SQL para esta funcionalidad
import db from '../config/db.js';

export const obtenerPosts = async () => {
    const sql = `
        SELECT
            f.*,
            u.nombres as autor,
            COUNT(c.id) as totalComentarios
        FROM Publicacion_Foro f
                 JOIN Usuario u ON f.idUsuario = u.id
                 LEFT JOIN Comentario_Foro c ON f.id = c.idPublicacion
        GROUP BY f.id
        ORDER BY f.fechaPublicacion DESC
    `;
    const [posts] = await db.query(sql);
    return posts;
};

export const crearPost = async (idUsuario, { titulo, contenido }) => {
    const sql = `INSERT INTO Publicacion_Foro (idUsuario, titulo, contenido) VALUES (?, ?, ?)`;
    const [res] = await db.execute(sql, [idUsuario, titulo, contenido]);
    return { id: res.insertId };
};

export const agregarComentario = async (idUsuario, { idPublicacion, contenido }) => {
    const sql = `INSERT INTO Comentario_Foro (idUsuario, idPublicacion, contenido) VALUES (?, ?, ?)`;
    await db.execute(sql, [idUsuario, idPublicacion, contenido]);
    return { mensaje: 'Comentario publicado' };
};

export const obtenerComentariosPorPost = async (idPublicacion) => {
    const sql = `
        SELECT c.*, u.nombres as autor 
        FROM Comentario_Foro c
        JOIN usuario u ON c.idUsuario = u.id
        WHERE c.idPublicacion = ?
        ORDER BY c.fechaPublicacion ASC
    `;
    const [comentarios] = await db.query(sql, [idPublicacion]);
    return comentarios;
};

export const actualizarPost = async (idPost, idUsuario, rol, datos) => {
    const { titulo, contenido } = datos;

    const sql = rol === 'admin'
        ? 'UPDATE Publicacion_Foro SET titulo = ?, contenido = ? WHERE id = ?'
        : 'UPDATE Publicacion_Foro SET titulo = ?, contenido = ? WHERE id = ? AND idUsuario = ?';

    const params = rol === 'admin' ? [titulo, contenido, idPost] : [titulo, contenido, idPost, idUsuario];

    const [result] = await db.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new Error('No se pudo actualizar: El post no existe o no tienes permiso.');
    }
};

export const eliminarPost = async (idPost, idUsuario, rol) => {
    const sql = rol === 'admin'
        ? 'DELETE FROM Publicacion_Foro WHERE id = ?'
        : 'DELETE FROM Publicacion_Foro WHERE id = ? AND idUsuario = ?';

    const params = rol === 'admin' ? [idPost] : [idPost, idUsuario];

    const [result] = await db.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new Error('No se pudo eliminar: El post no existe o no tienes permiso.');
    }
};

export const eliminarComentario = async (idComentario, idUsuario, rol) => {
    const sql = rol === 'admin'
        ? 'DELETE FROM Comentario_Foro WHERE id = ?'
        : 'DELETE FROM Comentario_Foro WHERE id = ? AND idUsuario = ?';

    const params = rol === 'admin' ? [idComentario] : [idComentario, idUsuario];

    const [result] = await db.execute(sql, params);

    if (result.affectedRows === 0) {
        throw new Error('No se pudo eliminar: El comentario no existe o no tienes permiso.');
    }
};
