// sidebarAuth.js — Validación de sesión y logout para vistas privadas
// Usar rutas absolutas del servidor
const API = '/api';

(function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return;
    }

    // Mostrar nombre de usuario en sidebar
    ['userNameDisplay', 'sidebar-nombre', 'admin-nombre', 'empresa-nombre', 'postulante-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.nombre || user.nombres || '';
    });

    // Logout
    document.querySelectorAll('.btn-logout, #logoutBtn, [data-logout]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
            } catch (_) {}
            localStorage.clear();
            window.location.href = '/login';
        });
    });
})();
