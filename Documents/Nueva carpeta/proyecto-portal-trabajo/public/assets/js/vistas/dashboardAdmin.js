// dashboardAdmin.js — VISTA_30_InicioAdmin
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }
    if (user.rol !== 'admin') { window.location.href = '/login'; return; }

    // Nombre en sidebar
    ['userNameDisplay', 'admin-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.nombre;
    });

    // ── Cargar estadísticas reales desde /api/perfil/admin/stats ─────────────
    try {
        const res  = await fetch(`${API}/perfil/admin/stats`, { credentials: 'include' });
        const data = await res.json();
        const s    = data.data || {};

        setEl('stat-total-usuarios',     s.totalUsuarios);
        setEl('stat-total-postulantes',  s.totalPostulantes);
        setEl('stat-total-empresas',     s.totalEmpresas);
        setEl('stat-total-empleos',      s.totalEmpleos);

        // También actualizar los module-stat estáticos si existen
        document.querySelectorAll('.module-row').forEach(row => {
            const nombre = row.querySelector('.name')?.textContent?.trim();
            const statEl = row.querySelector('.module-stat');
            if (!statEl) return;
            if (nombre === 'Usuarios')  statEl.textContent = `${s.totalUsuarios || 0} total`;
            if (nombre === 'Empleos')   statEl.textContent = `${s.totalEmpleos  || 0} total`;
        });

    } catch (err) {
        console.error('Error cargando stats de admin:', err);
    }
});

function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(value || 0).toLocaleString('es-SV');
}
