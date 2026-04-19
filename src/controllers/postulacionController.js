// Controlador: postulacionController
// Recibe req/res, llama al servicio correspondiente y delega errores con next(err)
import db from '../config/db.js';

export const obtenerMisPostulaciones = async (idCandidato) => {
    const sql = `
        SELECT p.*, e.titulo as tituloEmpleo, pe.nombreComercial as empresa
        FROM Postulacion p
        JOIN Empleo e ON p.idEmpleo = e.id
        JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE p.idCandidato = ?
        ORDER BY p.fechaPostulacion DESC
    `;
    const [rows] = await db.query(sql, [idCandidato]);
    return rows;
};

export const obtenerPostulantesPorEmpleo = async (idEmpleo, idEmpresa) => {
    const [empleo] = await db.query('SELECT id FROM Empleo WHERE id = ? AND idEmpresa = ?', [idEmpleo, idEmpresa]);
    if (empleo.length === 0) throw new Error('No tienes permiso para ver estas postulaciones');

    const sql = `
        SELECT p.*, c.nombres, c.apellidos, c.titulo, c.profesion
        FROM Postulacion p
        JOIN Perfil_Candidato c ON p.idCandidato = c.id
        WHERE p.idEmpleo = ?
    `;
    const [rows] = await db.query(sql, [idEmpleo]);
    return rows;
};

export const cambiarEstadoPostulacion = async (idPostulacion, idEmpresa, nuevoEstado) => {
    const sqlValidar = `
        SELECT p.id FROM Postulacion p
        JOIN Empleo e ON p.idEmpleo = e.id
        WHERE p.id = ? AND e.idEmpresa = ?
    `;
    const [valid] = await db.query(sqlValidar, [idPostulacion, idEmpresa]);
    if (valid.length === 0) throw new Error('No autorizado');

    await db.execute('UPDATE Postulacion SET estado = ? WHERE id = ?', [nuevoEstado, idPostulacion]);
    return { mensaje: 'Estado actualizado' };
};
