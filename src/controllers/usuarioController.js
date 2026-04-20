import * as UsuarioService from '../services/usuarioService.js';

export const updateCandidato = async (req, res, next) => {
    try {
        const { id } = req.session.usuario;
        await UsuarioService.actualizarPerfilCandidato(id, req.body);
        res.json({ status: 'success', message: 'Perfil actualizado' });
    } catch (error) { next(error); }
};

export const updateEmpresa = async (req, res, next) => {
    try {
        const { id } = req.session.usuario;
        await UsuarioService.actualizarPerfilEmpresa(id, req.body);
        res.json({ status: 'success', message: 'Perfil de empresa actualizado' });
    } catch (error) { next(error); }
};

export const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await UsuarioService.obtenerTodosLosUsuarios();
        res.json({ status: 'success', data: usuarios });
    } catch (error) {
        next(error);
    }
};

export const getUsuarioById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await UsuarioService.obtenerUsuarioPorId(id);
        res.json({ status: 'success', data: usuario });
    } catch (error) {
        next(error);
    }
};