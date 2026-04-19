import * as RecursoService from '../services/recursoService.js';

export const listar = async (req, res, next) => {
    try {
        const data = await RecursoService.obtenerRecursos();
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recurso = await RecursoService.obtenerRecursoPorId(id);
        res.json({ status: 'success', data: recurso });
    } catch (error) {
        next(error);
    }
};

export const publicar = async (req, res, next) => {
    try {
        const { id } = req.session.usuario;
        const data = await RecursoService.crearRecurso(id, req.body);
        res.status(201).json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const modificar = async (req, res, next) => {
    try {
        await RecursoService.actualizarRecurso(req.params.id, req.body);
        res.json({ status: 'success', message: 'Recurso actualizado' });
    } catch (error) { next(error); }
};

export const eliminar = async (req, res, next) => {
    try {
        await RecursoService.eliminarRecurso(req.params.id);
        res.json({ status: 'success', message: 'Recurso eliminado' });
    } catch (error) { next(error); }
};