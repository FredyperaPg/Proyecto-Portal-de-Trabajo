// checkAuth.js — Verifica sesión activa y redirige según rol
// Importar este script en TODAS las vistas privadas

(function() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
        window.location.href = '/login';
        return;
    }

    // Mapeo de rol → ruta base esperada
    const rolRoutes = {
        'admin':      '/admin/',
        'empleador':  '/empresa/',
        'empresa':    '/empresa/',
        'postulante': '/postulante/'
    };

    const rol      = (user.rol || '').toLowerCase();
    const rutaBase = rolRoutes[rol];
    const rutaActual = window.location.pathname;

    // Si el usuario está en la ruta incorrecta para su rol, redirigir
    if (rutaBase && !rutaActual.startsWith(rutaBase)) {
        const dashMap = {
            'admin':     '/admin/inicio',
            'empleador': '/empresa/inicio',
            'empresa':   '/empresa/inicio',
            'postulante':'/postulante/inicio'
        };
        window.location.href = dashMap[rol] || '/login';
    }
})();
