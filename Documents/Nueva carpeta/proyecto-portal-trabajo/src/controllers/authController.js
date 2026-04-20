// Controlador: authController
// Maneja la lógica de peticiones y respuestas para autenticación

import * as AuthService from '../services/authService.js';
import db from '../config/db.js';

export const registerPostulante = async (req, res, next) => {
    try {
        const data = await AuthService.registrarPostulante(req.body);
        res.status(201).json({ status: 'success', message: 'Postulante registrado con éxito', data });
    } catch (error) { next(error); }
};

export const registerEmpleador = async (req, res, next) => {
    try {
        const data = await AuthService.registrarEmpleador(req.body);
        res.status(201).json({ status: 'success', message: 'Empresa registrada con éxito', data });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validamos credenciales y obtenemos datos básicos del usuario
        const usuario = await AuthService.validarCredenciales(email, password);

        // BUG FIX #6: La tabla correcta es Perfil_Empresa (no 'empresas').
        // idUsuario es BINARY(16), por eso se usa UUID_TO_BIN para comparar.
        if (usuario.rol === 'empleador') {
            const [perfil] = await db.query(
                'SELECT BIN_TO_UUID(id) as idEmpresa FROM Perfil_Empresa WHERE idUsuario = UUID_TO_BIN(?)',
                [usuario.id]
            );
            if (perfil[0]) usuario.idEmpresa = perfil[0].idEmpresa;
        }

        // También guardamos idCandidato para postulantes (útil para postulaciones)
        if (usuario.rol === 'postulante') {
            const [perfil] = await db.query(
                'SELECT BIN_TO_UUID(id) as idCandidato FROM Perfil_Candidato WHERE idUsuario = UUID_TO_BIN(?)',
                [usuario.id]
            );
            if (perfil[0]) usuario.idCandidato = perfil[0].idCandidato;
        }

        // Guardamos en la sesión del servidor (backend)
        req.session.usuario = usuario;

        // BUG FIX: validarCredenciales devuelve 'correo'; lo mapeamos a 'email' para el frontend
        const userPayload = {
            id:          usuario.id,
            nombre:      usuario.nombre,
            nombres:     usuario.nombre,
            apellidos:   usuario.apellidos || '',
            email:       usuario.correo,
            rol:         usuario.rol,
            idEmpresa:   usuario.idEmpresa   || null,
            idCandidato: usuario.idCandidato || null
        };

        // También guardar en sesión del servidor
        req.session.usuario = userPayload;

        res.json({
            status:  'success',
            message: `Bienvenido, ${usuario.nombre}`,
            user:    userPayload
        });
    } catch (error) { next(error); }
};

export const checkSession = (req, res) => {
    if (req.session.usuario) {
        res.json({ loggedIn: true, user: req.session.usuario });
    } else {
        res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
};

// BUG FIX #8: Faltaba el parámetro 'next' en la firma de logout
export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.json({ status: 'success', message: 'Sesión cerrada correctamente' });
    });
};
