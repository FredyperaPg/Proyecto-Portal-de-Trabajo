/**
 * session.js — Utilidades globales de sesión
 * Incluir en TODAS las páginas: <script src="/assets/js/session.js"></script>
 */

const Session = {
    /**
     * Retorna el usuario del localStorage o null
     */
    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    },

    /**
     * Retorna el nombre del usuario en cualquiera de sus variantes
     */
    getNombre() {
        const u = this.getUser();
        if (!u) return 'Usuario';
        return u.nombre || u.nombres || u.email?.split('@')[0] || 'Usuario';
    },

    /**
     * Rellena todos los elementos con IDs conocidos de nombre de usuario
     */
    fillNombreElements() {
        const nombre = this.getNombre();
        const ids = [
            'userNameDisplay', 'sidebar-nombre', 'admin-nombre',
            'saludo-nombre', 'empresa-nombre', 'postulante-nombre',
            'user-display-name', 'header-nombre'
        ];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = nombre;
        });
        document.querySelectorAll('[data-user-nombre]').forEach(el => {
            el.textContent = nombre;
        });
    },

    /**
     * Redirige a /login si no hay sesión. Llamar en páginas privadas.
     */
    requireAuth() {
        if (!this.getUser()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    },

    /**
     * Limpia la sesión y redirige al login
     */
    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (_) {}
        localStorage.clear();
        window.location.href = '/login';
    },

    /**
     * Vincula todos los botones/links de logout automáticamente
     */
    bindLogoutButtons() {
        document.querySelectorAll('#logoutBtn, .btn-logout, [data-logout]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    },

    /**
     * Inicialización automática al cargar
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.fillNombreElements();
            this.bindLogoutButtons();
        });
    }
};

// Auto-init
Session.init();

// Exportar para uso en módulos
if (typeof window !== 'undefined') window.Session = Session;
