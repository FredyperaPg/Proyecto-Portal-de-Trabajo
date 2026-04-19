// Servicio: recursoService
// Contiene las consultas SQL para esta funcionalidad
import db from '../config/db.js';

export const obtenerRecursos = async () => {
    const [recursos] = await db.query('SELECT * FROM Recurso WHERE estado = "publicado"');
    return recursos;
};

export const obtenerRecursoPorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM Recurso WHERE id = ?', [id]);

    if (rows.length === 0) {
        const error = new Error('Recurso no encontrado');
        error.statusCode = 404; // Not Found
        throw error;
    }

    return rows[0];
};

export const crearRecurso = async (idUsuario, datos) => {
    const { titulo, contenido, tipo, urlBanner, urlVideo } = datos;
    const sql = `
        INSERT INTO Recurso (idUsuario, titulo, contenido, tipo, estado, urlBanner, urlVideo) 
        VALUES (?, ?, ?, ?, 'publicado', ?, ?)
    `;
    const [res] = await db.execute(sql, [idUsuario, titulo, contenido, tipo, urlBanner, urlVideo]);
    return { id: res.insertId };
};

export const actualizarRecurso = async (idRecurso, datos) => {
    const { titulo, contenido, tipo, urlBanner, urlVideo } = datos;
    const sql = `
        UPDATE Recurso 
        SET titulo = ?, contenido = ?, tipo = ?, urlBanner = ?, urlVideo = ? 
        WHERE id = ?
    `;
    const [result] = await db.execute(sql, [titulo, contenido, tipo, urlBanner, urlVideo, idRecurso]);

    if (result.affectedRows === 0) throw new Error('Recurso no encontrado');
    return { mensaje: 'Recurso actualizado' };
};

export const eliminarRecurso = async (idRecurso) => {
    const [result] = await db.execute('DELETE FROM Recurso WHERE id = ?', [idRecurso]);

    if (result.affectedRows === 0) throw new Error('Recurso no encontrado');
    return { mensaje: 'Recurso eliminado' };
};