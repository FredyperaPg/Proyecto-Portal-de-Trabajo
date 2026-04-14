// Controlador: authController
// Recibe req/res, llama al servicio correspondiente y delega errores con next(err)

import * as AuthService from '../services/authService.js';
import db from '../config/db.js';

export const registerPostulante = async (req, res, next) => {
    try {
        const data = await AuthService.registrarPostulante(req.body);
        res.status(201).json({ status: 'success', message: 'Postulante registrado', data });
    } catch (error) { next(error); }
};

export const registerEmpleador = async (req, res, next) => {
    try {
        const data = await AuthService.registrarEmpleador(req.body);
        res.status(201).json({ status: 'success', message: 'Empresa registrada', data });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const { correo, password } = req.body;
        const usuario = await AuthService.validarCredenciales(correo, password);

        if (usuario.rol === 'empleador') {
            const [perfil] = await db.query('SELECT id FROM Perfil_Empresa WHERE idUsuario = ?', [usuario.id]);
            if (perfil[0]) usuario.idEmpresa = perfil[0].id;
        }

        req.session.usuario = usuario;
        res.json({ status: 'success', message: 'Sesión iniciada', user: usuario });
    } catch (error) { next(error); }
};

export const checkSession = (req, res) => {
    if (req.session.usuario) {
        res.json({ loggedIn: true, user: req.session.usuario });
    } else {
        res.status(401).json({ loggedIn: false });
    }
};

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ status: 'success', message: 'Sesión cerrada' });
    });
};