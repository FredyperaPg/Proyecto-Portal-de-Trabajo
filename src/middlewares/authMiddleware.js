
export const isAuth = (req, res, next) => {
    if (req.session && req.session.usuario) {
        // Si todo está bien, permitimos que la petición siga su camino
        return next();
    }

    res.status(401).json({
        status: 'error',
        message: 'Sesión no válida o expirada. Por favor, inicia sesión.'
    });
};

export const isEmpresa = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'empleador') {
        return next();
    }

    res.status(403).json({
        status: 'error',
        message: 'Acceso denegado: Esta acción solo es permitida para empresas.'
    });
};

export const isCandidato = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'postulante') {
        return next();
    }

    res.status(403).json({
        status: 'error',
        message: 'Acceso denegado: Esta acción solo es permitida para postulantes.'
    });
};