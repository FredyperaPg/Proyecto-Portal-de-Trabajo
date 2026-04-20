// Controlador: empleoController
// Recibe req/res, llama al servicio correspondiente y delega errores con next(err)

import * as EmpleoService from '../services/empleoService.js';

export const publicarEmpleo = async (req, res, next) => {
    try {
        const { idEmpresa } = req.session.usuario;

        if (!idEmpresa) {
            const error = new Error('Solo los perfiles de empresa pueden publicar empleos');
            error.statusCode = 403;
            throw error;
        }

        const data = await EmpleoService.crearEmpleo(idEmpresa, req.body);

        res.status(201).json({
            status: 'success',
            message: 'Vacante publicada exitosamente',
            data
        });
    } catch (error) {
        next(error);
    }
};

export const listarEmpleos = async (req, res, next) => {
    try {
        const empleos = await EmpleoService.obtenerTodosLosEmpleos();
        res.json({ status: 'success', data: empleos });
    } catch (error) {
        next(error);
    }
};

export const obtenerDetalle = async (req, res, next) => {
    try {
        const empleo = await EmpleoService.obtenerEmpleoPorId(req.params.id);
        if (!empleo) return res.status(404).json({ status: 'error', message: 'Empleo no encontrado' });
        res.json({ status: 'success', data: empleo });
    } catch (error) { next(error); }
};

export const aplicarAEmpleo = async (req, res, next) => {
    try {
        const { idCandidato } = req.session.usuario;
        const { idEmpleo } = req.body;

        if (!idCandidato) {
            const error = new Error('Solo los perfiles de candidato pueden postularse');
            error.statusCode = 403;
            throw error;
        }

        const data = await EmpleoService.postularseAEmpleo(idCandidato, idEmpleo);

        res.json({
            status: 'success',
            message: 'Postulación enviada correctamente. ¡Mucho éxito!',
            data
        });
    } catch (error) { next(error); }
};

export const modificarEmpleo = async (req, res, next) => {
    try {
        const idEmpleo = req.params.id;
        const usuario = req.session.usuario; // Obtenemos el usuario de la sesión

        const resultado = await EmpleoService.actualizarEmpleo(idEmpleo, usuario, req.body);
        res.json({ status: 'success', data: resultado });
    } catch (error) {
        // Manejo de errores de permiso
        if (error.message === 'No tienes permiso para modificar este empleo') {
            return res.status(403).json({ status: 'error', message: error.message });
        }
        next(error);
    }
};

export const borrarEmpleo = async (req, res, next) => {
    try {
        const idEmpleo = req.params.id;
        const usuario = req.session.usuario;

        const resultado = await EmpleoService.eliminarEmpleo(idEmpleo, usuario);
        res.json({ status: 'success', data: resultado });
    } catch (error) {
        next(error);
    }
};