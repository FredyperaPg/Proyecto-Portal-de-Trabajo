// navbar.js — Menú dinámico según el rol del usuario
// Usa rutas absolutas del servidor para evitar errores de ruta relativa
const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const menuContainer = document.getElementById('menu-dinamico');
    if (!menuContainer) return;

    if (user) {
        const rol = user.rol?.toLowerCase();

        let dashURL, perfilURL;
        if (rol === 'admin') {
            dashURL   = '/admin/inicio';
            perfilURL = '/admin/inicio';
        } else if (rol === 'empleador' || rol === 'empresa') {
            dashURL   = '/empresa/inicio';
            perfilURL = '/empresa/mi-perfil';
        } else {
            dashURL   = '/postulante/inicio';
            perfilURL = '/postulante/perfil';
        }

        menuContainer.innerHTML = `
            <a class="nav-link" href="${dashURL}">Dashboard</a>
            <a class="nav-link" href="${perfilURL}">Mi Perfil</a>
            <div class="d-flex align-items-center ms-lg-3 gap-2">
                <span class="navbar-text">Hola, <strong>${escHtml(user.nombre || user.nombres || '')}</strong></span>
                <button class="btn btn-outline-danger btn-sm" id="logoutBtn">Cerrar Sesión</button>
            </div>
        `;

        document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
            } catch (_) {}
            localStorage.clear();
            window.location.href = '/login';
        });

    } else {
        menuContainer.innerHTML = `
            <div class="d-flex align-items-center ms-lg-2 gap-2">
                <a class="btn btn-primary btn-sm" href="/login">Iniciar Sesión</a>
                <a class="btn btn-outline-primary btn-sm" href="/registro">Registrarse</a>
            </div>
        `;
    }
});

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
