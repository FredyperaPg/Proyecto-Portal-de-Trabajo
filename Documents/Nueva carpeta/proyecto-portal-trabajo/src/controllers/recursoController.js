import * as RecursoService from '../services/recursoService.js';

export const getRecursos = async (req, res, next) => {
    try {
        const { tipo, busqueda } = req.query;
        const data = await RecursoService.getRecursos({ tipo, busqueda });
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

export const getRecurso = async (req, res, next) => {
    try {
        const recurso = await RecursoService.getRecursoPorId(req.params.id);
        if (!recurso) return res.status(404).json({ status: 'error', message: 'Recurso no encontrado' });
        res.json({ status: 'success', data: recurso });
    } catch (err) { next(err); }
};

export const crearRecurso = async (req, res, next) => {
    try {
        await RecursoService.crearRecurso(req.body);
        res.status(201).json({ status: 'success', message: 'Recurso creado' });
    } catch (err) { next(err); }
};
