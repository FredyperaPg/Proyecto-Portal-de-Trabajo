// Servicio: empleoService
// Contiene las consultas SQL para esta funcionalidad

import db from '../config/db.js';

export const crearEmpleo = async (idEmpresa, datos) => {
    const {
        titulo, descripcion, requisitos, funciones,
        categoria, modalidad, ubicacion, salarioMinimo,
        salarioMaximo, vacantes, fechaVencimiento
    } = datos;

    const sql = `
        INSERT INTO Empleo 
        (idEmpresa, titulo, descripcion, requisitos, funciones, categoria, modalidad, ubicacion, salarioMin, salarioMax, vacantes, fechaVencimiento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [resultado] = await db.execute(sql, [
        idEmpresa, titulo, descripcion, requisitos, funciones,
        categoria, modalidad, ubicacion, salarioMinimo, salarioMaximo,
        vacantes, fechaVencimiento
    ]);

    return { id: resultado.insertId, titulo };
};

export const obtenerTodosLosEmpleos = async () => {
    const sql = `
        SELECT e.*, pe.nombreComercial as empresa, pe.urlLogo 
        FROM Empleo e
        JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.estado = 'abierta'
        ORDER BY e.fechaPublicacion DESC
    `;
    const [empleos] = await db.query(sql);
    return empleos;
};

export const obtenerEmpleoPorId = async (id) => {
    const sql = `
        SELECT e.*, pe.nombreComercial as empresa, pe.urlLogo, pe.descripcion as descripcionEmpresa
        FROM Empleo e
        JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.id = ?
    `;
    const [resultado] = await db.query(sql, [id]);
    return resultado[0];
};

export const postularseAEmpleo = async (idCandidato, idEmpleo) => {
    const [existe] = await db.query(
        'SELECT id FROM Postulacion WHERE idCandidato = ? AND idEmpleo = ?',
        [idCandidato, idEmpleo]
    );

    if (existe.length > 0) {
        const error = new Error('Ya te has postulado a esta vacante anteriormente');
        error.statusCode = 400;
        throw error;
    }

    const sql = `INSERT INTO Postulacion (idCandidato, idEmpleo, estado) VALUES (?, ?, 'pendiente')`;
    const [resultado] = await db.execute(sql, [idCandidato, idEmpleo]);

    return { id: resultado.insertId, fecha: new Date() };
};

export const actualizarEmpleo = async (idEmpleo, usuario, datos) => {
    await verificarPropiedad(idEmpleo, usuario);

    const { titulo, descripcion, requisitos, funciones, salarioMinimo, salarioMaximo, vacantes } = datos;

    const sql = `
        UPDATE empleo 
        SET titulo = ?, descripcion = ?, requisitos = ?, funciones = ?, salarioMin = ?, salarioMax = ?, vacantes = ?
        WHERE id = ?
    `;

    await db.execute(sql, [titulo, descripcion, requisitos, funciones, salarioMinimo, salarioMaximo, vacantes, idEmpleo]);
    return { id: idEmpleo, mensaje: 'Empleo actualizado' };
};

export const eliminarEmpleo = async (idEmpleo, usuario) => {
    await verificarPropiedad(idEmpleo, usuario);

    await db.execute('DELETE FROM Empleo WHERE id = ?', [idEmpleo]);
    return { id: idEmpleo, mensaje: 'Empleo eliminado' };
};

const verificarPropiedad = async (idEmpleo, usuario) => {
    if (usuario.rol === 'admin') return true;

    const [empleos] = await db.query('SELECT idEmpresa FROM Empleo WHERE id = ?', [idEmpleo]);

    if (empleos.length === 0) throw new Error('El empleo no existe');

    if (empleos[0].idEmpresa !== usuario.idEmpresa) {
        throw new Error('No tienes permiso para modificar este empleo');
    }
    return true;
};