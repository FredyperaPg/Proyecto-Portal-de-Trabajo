// Controlador: empleoController
import * as EmpleoService from '../services/empleoService.js';

export const getEmpleos = async (req, res, next) => {
    try {
        const { categoria, modalidad, ubicacion, busqueda } = req.query;
        const empleos = await EmpleoService.getEmpleosActivos({ categoria, modalidad, ubicacion, busqueda });
        res.json({ status: 'success', data: empleos });
    } catch (error) { next(error); }
};

export const getEmpleo = async (req, res, next) => {
    try {
        const empleo = await EmpleoService.getEmpleoPorId(req.params.id);
        if (!empleo) return res.status(404).json({ status: 'error', message: 'Empleo no encontrado' });
        res.json({ status: 'success', data: empleo });
    } catch (error) { next(error); }
};

export const crearEmpleo = async (req, res, next) => {
    try {
        const data = await EmpleoService.crearEmpleo(req.body);
        res.status(201).json({ status: 'success', message: 'Empleo publicado con éxito', data });
    } catch (error) { next(error); }
};

export const getEmpleosDeEmpresa = async (req, res, next) => {
    try {
        const { idEmpresa } = req.params;
        const data = await EmpleoService.getEmpleosDeEmpresa(idEmpresa);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const updateEstadoEmpleo = async (req, res, next) => {
    try {
        const { id }     = req.params;
        const { estado } = req.body;
        await EmpleoService.updateEstadoEmpleo(id, estado);
        res.json({ status: 'success', message: 'Estado del empleo actualizado' });
    } catch (error) { next(error); }
};
