// Controlador: foroController
// Recibe req/res, llama al servicio correspondiente y delega errores con next(err)
import * as ForoService from '../services/foroService.js';

export const listarForo = async (req, res, next) => {
    try {
        const posts = await ForoService.obtenerPosts();
        res.json({ status: 'success', data: posts });
    } catch (error) { next(error); }
};

export const publicar = async (req, res, next) => {
    try {
        const { id } = req.session.usuario;
        const data = await ForoService.crearPost(id, req.body);
        res.status(201).json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const agregarComentario = async (req, res, next) => {
    try {
        const { id } = req.session.usuario;
        const { idPublicacion, contenido } = req.body;

        await ForoService.agregarComentario(id, { idPublicacion, contenido });

        res.status(201).json({
            status: 'success',
            message: 'Comentario publicado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

export const listarComentarios = async (req, res, next) => {
    try {
        const { id } = req.params; // ID de la publicación
        const comentarios = await ForoService.obtenerComentariosPorPost(id);

        res.json({ status: 'success', data: comentarios });
    } catch (error) {
        next(error);
    }
};

export const modificarPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: idUsuario, rol } = req.session.usuario;

        await ForoService.actualizarPost(id, idUsuario, rol, req.body);

        res.json({ status: 'success', message: 'Publicación actualizada correctamente' });
    } catch (error) {
        next(error);
    }
};

export const borrarPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: idUsuario, rol } = req.session.usuario;

        await ForoService.eliminarPost(id, idUsuario, rol);

        res.json({ status: 'success', message: 'Publicación eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};

export const borrarComentario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: idUsuario, rol } = req.session.usuario;

        await ForoService.eliminarComentario(id, idUsuario, rol);

        res.json({ status: 'success', message: 'Comentario eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};