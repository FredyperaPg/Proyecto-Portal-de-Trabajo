// Controlador: perfilController
import * as PerfilService from '../services/perfilService.js';

// ── POSTULANTE ────────────────────────────────────────────────────────────────

export const getPerfilPostulante = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const perfil = await PerfilService.getPerfilPostulante(idUsuario);
        if (!perfil) return res.status(404).json({ status: 'error', message: 'Perfil no encontrado' });
        res.json({ status: 'success', data: perfil });
    } catch (error) { next(error); }
};

export const updatePerfilPostulante = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        await PerfilService.updatePerfilPostulante(idUsuario, req.body);
        res.json({ status: 'success', message: 'Perfil actualizado correctamente' });
    } catch (error) { next(error); }
};

// ── EMPRESA ───────────────────────────────────────────────────────────────────

export const getPerfilEmpresa = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const perfil = await PerfilService.getPerfilEmpresa(idUsuario);
        if (!perfil) return res.status(404).json({ status: 'error', message: 'Perfil de empresa no encontrado' });
        res.json({ status: 'success', data: perfil });
    } catch (error) { next(error); }
};

export const updatePerfilEmpresa = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        await PerfilService.updatePerfilEmpresa(idUsuario, req.body);
        res.json({ status: 'success', message: 'Perfil de empresa actualizado' });
    } catch (error) { next(error); }
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getAdminStats = async (req, res, next) => {
    try {
        const stats = await PerfilService.getAdminStats();
        res.json({ status: 'success', data: stats });
    } catch (error) { next(error); }
};

export const getUsuarios = async (req, res, next) => {
    try {
        const data = await PerfilService.getUsuarios();
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

export const getUsuarioPorId = async (req, res, next) => {
    try {
        const user = await PerfilService.getUsuarioPorId(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        res.json({ status: 'success', data: user });
    } catch (err) { next(err); }
};

export const updateEstadoUsuario = async (req, res, next) => {
    try {
        const { estado } = req.body;
        await PerfilService.updateEstadoUsuario(req.params.id, estado);
        res.json({ status: 'success', message: 'Estado actualizado' });
    } catch (err) { next(err); }
};
