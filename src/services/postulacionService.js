// Servicio: postulacionService
// Contiene las consultas SQL para esta funcionalidad
import * as PostulacionService from '../services/postulacionservice.js';

export const getMisPostulaciones = async (req, res, next) => {
    try {
        const { idCandidato } = req.session.usuario;
        const data = await PostulacionService.obtenerMisPostulaciones(idCandidato);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const getPostulantes = async (req, res, next) => {
    try {
        const { idEmpresa } = req.session.usuario;
        const { idEmpleo } = req.params;
        const data = await PostulacionService.obtenerPostulantesPorEmpleo(idEmpleo, idEmpresa);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const updateEstado = async (req, res, next) => {
    try {
        const { idEmpresa } = req.session.usuario;
        const { idPostulacion } = req.params;
        const { estado } = req.body;
        const data = await PostulacionService.cambiarEstadoPostulacion(idPostulacion, idEmpresa, estado);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};