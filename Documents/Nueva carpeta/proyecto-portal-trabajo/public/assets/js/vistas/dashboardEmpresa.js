// dashboardEmpresa.js — VISTA_22_InicioEmpresa
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    // ── 1. SESIÓN ────────────────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }
    if (user.rol !== 'empleador' && user.rol !== 'empresa') {
        window.location.href = '/login'; return;
    }

    // ── 2. NOMBRE ─────────────────────────────────────────────────────────────
    const nombre = user.nombre || user.nombres || 'Mi Empresa';
    ['userNameDisplay','saludo-nombre','empresa-nombre','empresa-nombre-sidebar','sidebar-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = nombre;
    });
    document.querySelectorAll('[data-user-nombre]').forEach(el => el.textContent = nombre);

    // ── 3. LOGOUT ─────────────────────────────────────────────────────────────
    document.querySelectorAll('#logoutBtn, .btn-logout, [data-logout]').forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            try { await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (_) {}
            localStorage.clear();
            window.location.href = '/login';
        });
    });

    // ── 4. VERIFICAR PERFIL EMPRESA ───────────────────────────────────────────
    if (!user.idEmpresa) {
        // Try to fetch it from the server in case it wasn't in the token
        try {
            const r = await fetch(`${API}/perfil/empresa/${user.id}`, { credentials: 'include' });
            if (r.ok) {
                const d = await r.json();
                user.idEmpresa = d.data?.id;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (_) {}
    }

    if (!user.idEmpresa) {
        mostrarError('jobs-empresa-container',
            'No se encontró el perfil de empresa. <a href="/empresa/mi-perfil">Completa tu perfil</a>.');
        return;
    }

    // ── 5. VACANTES PUBLICADAS ────────────────────────────────────────────────
    const container     = document.getElementById('jobs-empresa-container');
    const cntActivas    = document.getElementById('count-activas');
    const cntPendientes = document.getElementById('count-pendientes');
    const cntTotal      = document.getElementById('count-total');

    if (container) container.innerHTML = skeletonCards(3);

    try {
        const res   = await fetch(`${API}/empleos/empresa/${user.idEmpresa}`, { credentials: 'include' });
        const data  = await res.json();
        const empleos = data.data || [];

        const activas    = empleos.filter(e => e.estado === 'abierta').length;
        const postulaciones = empleos.reduce((acc, e) => acc + (Number(e.totalPostulaciones) || 0), 0);
        if (cntActivas)    cntActivas.textContent    = activas;
        if (cntPendientes) cntPendientes.textContent = postulaciones;
        if (cntTotal)      cntTotal.textContent      = empleos.length;

        if (!container) return;

        if (empleos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-briefcase fs-1 d-block mb-3"></i>
                    <p>Aún no has publicado ninguna oferta.</p>
                    <a href="/empresa/publicar" class="btn btn-primary btn-sm">
                        <i class="bi bi-plus-circle me-1"></i>Publicar primera oferta
                    </a>
                </div>`;
        } else {
            container.innerHTML = empleos.slice(0, 6).map(e => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="fw-bold mb-0">${escHtml(e.titulo)}</h6>
                                <span class="badge ${e.estado === 'abierta' ? 'bg-success' : 'bg-secondary'}">${e.estado}</span>
                            </div>
                            <p class="text-muted small mb-1">
                                <i class="bi bi-geo-alt me-1"></i>${escHtml(e.ubicacion)} · ${escHtml(e.modalidad)}
                            </p>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-people me-1"></i>${e.totalPostulaciones || 0} postulaciones
                            </p>
                        </div>
                        <div class="card-footer bg-transparent border-0 pt-0 d-flex gap-2">
                            <a href="/empresa/oferta/detalle?id=${e.id}" class="btn btn-outline-primary btn-sm flex-fill">Ver</a>
                            <a href="/empresa/oferta/aplicaciones?id=${e.id}" class="btn btn-outline-secondary btn-sm flex-fill">Postulantes</a>
                        </div>
                    </div>
                </div>`).join('');
        }
    } catch (err) {
        if (container) mostrarError('jobs-empresa-container', 'Error al cargar las ofertas.');
    }
});

function mostrarError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="col-12 text-center py-4 text-muted">
        <i class="bi bi-exclamation-circle me-2"></i>${msg}</div>`;
}

function skeletonCards(n) {
    return Array(n).fill(0).map(() => `
        <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm placeholder-glow" style="min-height:130px;">
                <div class="card-body">
                    <div class="placeholder col-8 mb-2" style="height:16px;border-radius:4px;"></div>
                    <div class="placeholder col-5" style="height:12px;border-radius:4px;"></div>
                </div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
