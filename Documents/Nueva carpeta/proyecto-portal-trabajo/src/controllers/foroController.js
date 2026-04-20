import * as ForoService from '../services/foroService.js';

export const getPublicaciones = async (req, res, next) => {
    try {
        const { busqueda } = req.query;
        const data = await ForoService.getPublicaciones({ busqueda });
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

export const getPublicacion = async (req, res, next) => {
    try {
        const pub = await ForoService.getPublicacionPorId(req.params.id);
        if (!pub) return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
        res.json({ status: 'success', data: pub });
    } catch (err) { next(err); }
};

export const getComentarios = async (req, res, next) => {
    try {
        const data = await ForoService.getComentariosPorPublicacion(req.params.id);
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

export const crearPublicacion = async (req, res, next) => {
    try {
        const { idUsuario, titulo, contenido } = req.body;
        await ForoService.crearPublicacion({ idUsuario, titulo, contenido });
        res.status(201).json({ status: 'success', message: 'Publicación creada' });
    } catch (err) { next(err); }
};

export const crearComentario = async (req, res, next) => {
    try {
        const { idUsuario, contenido } = req.body;
        const idPublicacion = req.params.id;
        await ForoService.crearComentario({ idUsuario, idPublicacion, contenido });
        res.status(201).json({ status: 'success', message: 'Comentario agregado' });
    } catch (err) { next(err); }
};

export const darLike = async (req, res, next) => {
    try {
        await ForoService.darLike(req.params.id);
        res.json({ status: 'success', message: 'Like registrado' });
    } catch (err) { next(err); }
};
